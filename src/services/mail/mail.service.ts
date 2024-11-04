import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import * as sgMail from '@sendgrid/mail'; // Import SendGrid
import { UserService } from '../user/user.service'; // Import UserService
import { Types } from 'mongoose';
import { eventRegistrationTemplate } from '../../helpers/templates/event.register/event.register.template';
import { eventCancelRegistrationTemplate } from '../../helpers/templates/event.cancel/event.cancel.template';

@Injectable()
export class EventMailService {
  constructor(
    private readonly userService: UserService, // Injecting UserService for user retrieval
    private readonly configService: ConfigService, // Injecting ConfigService
  ) {
    // Set SendGrid API Key using ConfigService
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY')!;
    sgMail.setApiKey(apiKey);
  }

  // Method to send an email
  private async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    const fromEmail = this.configService.get<string>('FROM_ADDRESS')!;

    // Validate the 'from' email address
    if (!fromEmail) {
      console.error(
        'FROM_ADDRESS is not defined in the environment variables.',
      );
      return;
    }

    const msg = {
      to, // recipient email
      from: {
        email: fromEmail, // sender email from environment variables
        name: 'Zazz.io', // Optional: you can specify the sender's name
      },
      subject, // email subject
      text, // plain text version of the email
      html, // HTML version of the email
    };

    try {
      // Send email using SendGrid
      await sgMail.send(msg);
      console.log('Email sent successfully');
    } catch (error) {
      // Handle error as an instance of Error
      if (error instanceof Error) {
        console.error('Error sending email:', error.message);
        if ((error as any).response) {
          // Use type assertion for the response
          console.error(
            'SendGrid response error:',
            (error as any).response.body,
          );
        }
      } else {
        console.error('Unknown error occurred:', error);
      }
    }
  }

  // Send registration confirmation email
  async sendEventRegistrationMail(
    userId: Types.ObjectId,
    eventTitle: string,
  ): Promise<void> {
    // Retrieve user from database
    const user = await this.userService.userById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Email details
    const to = user.email;
    // console.log('sender mail: ', to);

    const subject = `${user.username}, you are successfully registered for the ${eventTitle} event!`;
    const text = `Dear ${user.username},\n\nYou have successfully registered for the ${eventTitle} event.`;
    const template = await eventRegistrationTemplate(user.username, eventTitle);

    // Send the email using the sendMail method
    await this.sendMail(to, subject, text, template);
  }

  // Send cancellation confirmation email
  async sendEventCancelRegistrationMail(
    userId: Types.ObjectId,
    eventTitle: string,
  ): Promise<void> {
    // Retrieve user from database
    const user = await this.userService.userById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Email details
    const to = user.email;
    const subject = `${user.username}, you have successfully cancelled the registered ${eventTitle} event!`;
    const text = `Dear ${user.username},\n\nYou have successfully cancelled the registered ${eventTitle} event.`;
    const template = await eventCancelRegistrationTemplate(
      user.username,
      eventTitle,
    );

    // Send the email using the sendMail method
    await this.sendMail(to, subject, text, template);
  }
}

// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config'; // Import ConfigService
// import * as sgMail from '@sendgrid/mail'; // Import SendGrid
// import { UserService } from '../user/user.service'; // Import UserService
// import { Types } from 'mongoose';
// import { eventRegistrationTemplate } from '../../helpers/templates/event.register/event.register.template';
// import { eventCancelRegistrationTemplate } from '../../helpers/templates/event.cancel/event.cancel.template';

// @Injectable()
// export class EventMailService {
//   constructor(
//     private readonly userService: UserService, // Injecting UserService for user retrieval
//     private readonly configService: ConfigService, // Injecting ConfigService
//   ) {
//     // Set SendGrid API Key using ConfigService
//     const apiKey = this.configService.get<string>('SENDGRID_API_KEY')!;
//     sgMail.setApiKey(apiKey);
//   }

//   // Method to send an email
//   private async sendMail(
//     to: string,
//     subject: string,
//     text: string,
//     html: string,
//   ): Promise<void> {
//     const msg = {
//       to, // recipient email
//       from: this.configService.get<string>('FROM_ADDRESS')!, // sender email from environment variables
//       subject, // email subject
//       text, // plain text version of the email
//       html, // HTML version of the email
//     };

//     try {
//       // Send email using SendGrid
//       await sgMail.send(msg);
//       console.log('Email sent successfully');
//     } catch (error) {
//       // Handle error as an instance of Error
//       if (error instanceof Error) {
//         console.error('Error sending email:', error.message);
//         if ((error as any).response) {
//           // Use type assertion for the response
//           console.error(
//             'SendGrid response error:',
//             (error as any).response.body,
//           );
//         }
//       } else {
//         console.error('Unknown error occurred:', error);
//       }
//     }
//   }

//   // Send registration confirmation email
//   async sendEventRegistrationMail(
//     userId: Types.ObjectId,
//     eventTitle: string,
//   ): Promise<void> {
//     // Retrieve user from database
//     const user = await this.userService.userById(userId);
//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Email details
//     const to = user.email;
//     const subject = `${user.username}, you are successfully registered for the ${eventTitle} event!`;
//     const text = `Dear ${user.username},\n\nYou have successfully registered for the ${eventTitle} event.`;
//     const template = await eventRegistrationTemplate(user.username, eventTitle);

//     // Send the email using the sendMail method
//     await this.sendMail(to, subject, text, template);
//   }

//   // Send cancellation confirmation email
//   async sendEventCancelRegistrationMail(
//     userId: Types.ObjectId,
//     eventTitle: string,
//   ): Promise<void> {
//     // Retrieve user from database
//     const user = await this.userService.userById(userId);
//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Email details
//     const to = user.email;
//     const subject = `${user.username}, you have successfully cancelled the registered ${eventTitle} event!`;
//     const text = `Dear ${user.username},\n\nYou have successfully cancelled the registered ${eventTitle} event.`;
//     const template = await eventCancelRegistrationTemplate(
//       user.username,
//       eventTitle,
//     );

//     // Send the email using the sendMail method
//     await this.sendMail(to, subject, text, template);
//   }
// }
