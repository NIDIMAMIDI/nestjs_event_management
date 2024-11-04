import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PasswordMismatchException } from '../../exception/passwordMismatch/passwordMismatch.exception';
import { AuthService } from '../../services/auth/auth.service';
import { SignUpDto } from '../../dto/user/signup/signup.user.dto';
import { JwtServices } from '../../services/jwt/jwt.service';
import { UserService } from '../../services/user/user.service';
import { Response } from 'express';
import { UserEntity } from '../../helpers/exclude-properties/exclude-properties.helpers';
import { SignInDto } from '../../dto/user/signin/signin.user.dto';
import { passwordChecking } from '../../helpers/passwordHashing/passwordHashing.helpers';
import { AuthGuard } from '../../guards/auth/auth.guard';

import { AuthenticatedRequest } from '../../interface/user/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtServices,
    private userService: UserService,
  ) {}

  //    Registration

  @HttpCode(201)
  @Post('signup')
  async userSign(@Body() data: SignUpDto, @Res() response: Response) {
    // Check if the passwords match
    if (data.password !== data.confirmPassword) {
      throw new PasswordMismatchException(); // Throw a custom exception if passwords do not match
    }

    // Register the user
    const user = await this.authService.userRegistration(data);

    // Create a JWT token and get cookie options
    const { token, cookieOptions } = await this.jwtService.createJwtToken(user);

    // Update the user's token in the database
    await this.userService.userTokenUpdate(user._id, token);

    // Fetch the updated user details
    const UserDetails = await this.userService.userById(user._id);

    // Destructure necessary fields from updated user details
    const userDetails = new UserEntity({
      username: UserDetails?.username,
      email: UserDetails?.email,
      _id: UserDetails?._id.toString(),
      role: UserDetails?.role,
      token: UserDetails?.token,
    });

    // Set the JWT token in a cookie
    response.cookie('jwt', token, cookieOptions);

    // Return success response
    response.status(201).json({
      message: `${userDetails.username} registration is successful`,
      userDetails,
    });
  }

  //      Login

  @HttpCode(200)
  @Post('login')
  async signIn(@Body() data: SignInDto, @Res() response: Response) {
    const { email, password } = data;
    // converting email to a lowerCase
    const loweredEmail = email.toLowerCase();

    // check if user email exists in database
    const existingUser = await this.userService.userExists(loweredEmail);
    if (!existingUser) {
      throw new NotFoundException(
        `User with ${loweredEmail} email doesn't exist`,
      );
    }

    // check if password is correct or not
    const isPAsswordCorrect = await passwordChecking(
      password,
      existingUser.password,
    );

    // if provided password does not match stored password it will throw the error response
    if (!isPAsswordCorrect) {
      throw new UnauthorizedException('Incorrect password');
    }

    // Create a JWT token and get cookie options
    const { token, cookieOptions } =
      await this.jwtService.createJwtToken(existingUser);

    // Update the user's token in the database
    await this.userService.userTokenUpdate(existingUser._id, token);

    // Fetch the updated user details
    const UserDetails = await this.userService.userById(existingUser._id);

    // Destructure necessary fields from updated user details
    const userDetails = new UserEntity({
      username: UserDetails?.username,
      email: UserDetails?.email,
      _id: UserDetails?._id.toString(),
      role: UserDetails?.role,
      token: UserDetails?.token,
    });

    // Set the JWT token in a cookie
    response.cookie('jwt', token, cookieOptions);

    // Return success response
    response.status(201).json({
      message: `${userDetails.username} registration is successful`,
      userDetails,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    const user = request.user;

    // Check if user exists in the request (to ensure a valid token was provided)
    if (!user) {
      throw new UnauthorizedException('User not found or not logged in');
    }

    // Clear the stored token in the user's record in the database
    await this.userService.removeToken(user._id);

    // Clear the cookie containing the JWT by setting it with a past expiration date
    response.cookie('jwt', '', {
      httpOnly: true,
      secure: true, // Set this to true if your API is served over HTTPS
      expires: new Date(0), // Set the cookie expiration to a past date
    });

    // Respond with a success message
    return response.status(200).json({
      message: 'Logout successful',
    });
  }
}
