import logo from '@assets/logo.png';
import logoSvg from '@assets/logo.svg';
import responsiveImg from '@assets/logo.png?sizes[]=300,sizes[]=600,sizes[]=1024';

console.log(logo);
const image = new Image();
image.src = logo;
document.body.appendChild(image);

console.log(logoSvg);
const image2 = new Image();
image2.src = logoSvg;
document.body.appendChild(image2);

console.log('responsiveImg', responsiveImg);
const image3 = new Image();
image3.srcset = responsiveImg.srcSet;
image3.sizes = `(min-width: 1024) 1024px,100vw`;
document.body.appendChild(image3);