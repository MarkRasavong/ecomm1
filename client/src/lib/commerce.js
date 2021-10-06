import Commerce from '@chec/commerce.js';

export const commerce = new Commerce(process.env.REACT_APP_CHEC_PUBLIC_KEY, true);

/*
Commerce Products
1. Create a commerce js accnt and grab public key into .env file
2. init model with public key and 2nd arg
3. 
*/