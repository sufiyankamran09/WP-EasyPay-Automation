// Test configuration file
export const testConfig = {
  // WordPress credentials
  credentials: {
    username: 'sesotatuca6068',
    password: 'TestingQA@79791'
  },
  
  // URLs
  urls: {
    login: 'https://wppayautomation.instawp.xyz/wp-login.php',
    admin: 'https://wppayautomation.instawp.xyz/wp-admin/',
    page:   'https://wppayautomation.instawp.xyz/wp-admin/post-new.php?post_type=page',
    pages: 'https://wppayautomation.instawp.xyz/wp-admin/edit.php?post_type=page',
    forms: 'https://wppayautomation.instawp.xyz/wp-admin/edit.php?post_type=wp_easy_pay'
  },
  
  // Test data
  formData: {
    title: 'Simple Form',
    description: 'This is the simple form description',
    amounts: {
      option1: '10',
      option2: '20',
      option3: '30',
      option4: '40'
    },
    minAmount: '10',
    maxAmount: '1000',
    successMessage: 'Your Payment Successfully sent.',
    termsLabel: 'This is the terms and condition',
    termsUrl: 'www.google.com',
    termsUrl1: 'https://wpeasypay.com/documentation/'
  },
  
  // Payment test data
  paymentData: {
    firstName: 'muhammad',
    lastName: 'sufiyan',
    email: 'sufi@09.com',
    amount: '200',
    cardNumber: '4111 1111 1111 1111',
    expiry: '11/29',
    cvv: '321',
    zip: '43523'
  },
  
  // Timeouts
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    veryLong: 60000
  }
}; 