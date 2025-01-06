
const localpath = "https://real-time-chat-backend-seven.vercel.app";

const api_paths = {

     backendPath: `${localpath}`,
     register: `${localpath}/signup`,
     login: `${localpath}/user/login`,

     UserData: `${localpath}/user/userdata`,
     SearchUser: `${localpath}/user/search`,
     GetAllUsers: `${localpath}/user/Alluser`,
     ImageUpload: `${localpath}/image/upload`,

     // forgetpass: `${localpath}/forgetpass`,
     // otpverify: `${localpath}/verify`,
     // all_products: `${localpath}/products/allproducts`,
     // popularinwomen: `${localpath}/products/popularinwomen`,
     // newcollections: `${localpath}/products/newcollections`,
     // GetOtpTimer : `${localpath}/GetOtpTimer`,
     // UpdatePass : `${localpath}/UpdatePass`,
     // singleproduct : `${localpath}/products`,
     // addtocart : `${localpath}/cart/addtocart`,
     // removefromcart : `${localpath}/cart/removefromcart`,
     // getcartitem : `${localpath}/cart/getcartitem`,

}

export default api_paths;
