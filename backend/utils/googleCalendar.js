const { google } = require('googleapis');

// Validate environment variables
const validateEnv = () => {
  const required = ['CALENDAR_CLIENT_ID', 'CALENDAR_CLIENT_SECRET', 'CALENDAR_REFRESH_TOKEN'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

const oauth2Client = new google.auth.OAuth2(
  process.env.CALENDAR_CLIENT_ID,
  process.env.CALENDAR_CLIENT_SECRET,
  'http://localhost:5000/oauth2callback'
);

// Set credentials
oauth2Client.setCredentials({
  refresh_token: process.env.CALENDAR_REFRESH_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Parse time string to hours and minutes (supports both 12-hour and 24-hour formats)
const parseTime = (timeStr) => {
  timeStr = timeStr.trim();
  
  // Try 12-hour format first (e.g., "10:00 AM" or "2:30 PM")
  const twelveHourMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (twelveHourMatch) {
    let hour = parseInt(twelveHourMatch[1]);
    const minute = parseInt(twelveHourMatch[2]);
    const ampm = twelveHourMatch[3].toUpperCase();
    
    // Convert to 24-hour
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    }
    if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return { hour, minute };
  }
  
  // Try 24-hour format (e.g., "16:30" or "09:15")
  const twentyFourHourMatch = timeStr.match(/(\d+):(\d+)/);
  if (twentyFourHourMatch) {
    const hour = parseInt(twentyFourHourMatch[1]);
    const minute = parseInt(twentyFourHourMatch[2]);
    
    // Validate 24-hour format
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return { hour, minute };
    }
  }
  
  throw new Error(`Unable to parse time: ${timeStr}`);
};

const createCalendarEvent = async (booking) => {
  try {
    // Validate environment first
    validateEnv();
    
    console.log('📅 Creating calendar event for:', booking.name);
    console.log('📍 Slot:', booking.slot);
    console.log('📅 Date:', booking.sessionDate);
    
    const sessionDate = new Date(booking.sessionDate);
    
    // Validate session date
    if (isNaN(sessionDate.getTime())) {
      throw new Error('Invalid session date');
    }
    
    // Split the slot time (e.g., "16:30 - 16:50" or "10:00 AM - 11:00 AM")
    const slotParts = booking.slot.split(' - ');
    
    if (slotParts.length !== 2) {
      throw new Error(`Invalid slot format: ${booking.slot}. Expected format: "HH:MM - HH:MM" or "HH:MM AM/PM - HH:MM AM/PM"`);
    }
    
    const [startTimeStr, endTimeStr] = slotParts;
    
    console.log('🕐 Start time string:', startTimeStr);
    console.log('🕐 End time string:', endTimeStr);
    
    // Parse start and end times
    const startTime = parseTime(startTimeStr);
    const endTime = parseTime(endTimeStr);
    
    console.log('🔢 Parsed start time:', startTime);
    console.log('🔢 Parsed end time:', endTime);
    
    // Create start and end datetime objects
    const startDateTime = new Date(sessionDate);
    startDateTime.setHours(startTime.hour, startTime.minute, 0, 0);
    
    const endDateTime = new Date(sessionDate);
    endDateTime.setHours(endTime.hour, endTime.minute, 0, 0);
    
    console.log('📅 Start DateTime:', startDateTime.toISOString());
    console.log('📅 End DateTime:', endDateTime.toISOString());
    
    // Validate times
    if (endDateTime <= startDateTime) {
      throw new Error('End time must be after start time');
    }

    const event = {
      summary: `Startup Clinic Session - ${booking.name}`,
      description: `
Startup Clinic Session

Client: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}

Questions:
1. ${booking.question1 || 'Not provided'}
2. ${booking.question2 || 'Not provided'}
3. ${booking.question3 || 'Not provided'}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      attendees: [
        { email: booking.email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    console.log('🚀 Sending event to Google Calendar...');
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all',
    });

    console.log(`✅ Calendar event created successfully: ${response.data.id}`);
    console.log(`🔗 Event link: ${response.data.htmlLink}`);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error creating calendar event:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // More specific error messages
    if (error.code === 401) {
      throw new Error('Calendar authentication failed. Please regenerate your refresh token.');
    } else if (error.code === 403) {
      throw new Error('Calendar access denied. Check if Google Calendar API is enabled.');
    } else if (error.code === 404) {
      throw new Error('Calendar not found. Make sure you have a Google Calendar.');
    } else {
      throw error;
    }
  }
};

module.exports = { createCalendarEvent };