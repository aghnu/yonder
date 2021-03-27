
import { Container } from "react-bulma-components";
import YonderIcon from "./YonderIcon.gif";

var logoStyling = {
    scale: "50",
    style: {
      fill: "#C96262",
      padding: "0.1em",
    }
  }

function YonderMainLogo() {
    // a placeholder
    return (
        <Container style={logoStyling.style}>
            <h style={{ fontSize:`30px`, fontFamily:"'Brush Script MT', cursive", marginRight:10 }}>Yonder</h>
            <img src={YonderIcon} />
            {/* <svg xmlns="http://www.w3.org/2000/svg" width={logoStyling.scale} viewBox="0 0 124.095 123.871">
            <g id="Group_31" data-name="Group 31" transform="translate(-0.363 -0.723)">
                <path id="Path_90" d="M81.2,3.267c-.792-.223-1.585-.427-2.372-.619A70.43,70.43,0,0,0,68.106.943,66.318,66.318,0,0,0,33.735,7.393C19.633,13.96,11.7,27.206,11.7,27.206l18.8,6.539-.232,9.009s-3.682-3.029-8.6-6.569S10.579,28.6,10.579,28.6-1.116,45.449.52,66.812s17.25,38.5,17.25,38.5a31.254,31.254,0,0,1,8.531-3.425,47.887,47.887,0,0,1,8.79-.963,24.967,24.967,0,0,0,.382-11.33,26.836,26.836,0,0,0-5.781-10.052l2.276-16.863L15.355,71.031,9.882,67.99,30.769,58.8l2.521-5.514,6.528,4.434a13.716,13.716,0,0,0-3.28,4.57,41.946,41.946,0,0,0-2.08,7.42c-1.014,4.161-1.725,9.172-1.725,9.172s6.074,6.454,6.585,9.028-1.074,13.031-1.074,13.031l28.639.529s26.793,1.172,29.691.664c6-1.052,17.627-5.532,17.627-5.532s9.277-15.527,10.151-30.86-3.9-24.827-7.98-33.407S105.39,17.371,96.956,10.824A46.163,46.163,0,0,0,81.2,3.267Zm-6.42,12.071,6.985,3.6s-1.9-.123-10.587,3.031S47,31.552,47,31.552l-7.112-2.9s8.9-2.592,17.634-5.919,17.261-7.4,17.261-7.4ZM87.732,34.359l7.445,3.446L70.248,45.672l6.2,4.813-.952,5.127s2.378,21.565,6.729,25.349,16.219-.354,17.947-3.11-3.3-19.561-3.3-19.561l1.843-.394s4.795,14.908,5.851,17.451a13.5,13.5,0,0,0,2.808,4.211s-2.78,2.542-9.883,4.984-12.337,4.732-17.924.166c-3.064-2.5-5.06-12.307-6.818-21.263-1.335-6.809-2.677-13.137-2.935-13.892a7.311,7.311,0,0,0-1.92-2.82l-10.046,3.8,5.507,4.685a12.424,12.424,0,0,0-2.011,4.816A67.642,67.642,0,0,1,57.9,80.528,62.484,62.484,0,0,1,47.318,98.344l-.223-.1-1.787-.8a66.121,66.121,0,0,0,9-18.346A82.572,82.572,0,0,0,56.87,57.377l-1.344-6.352-9.909,5.212-6.662-3.89a111.911,111.911,0,0,0,17.207-5.331c12.192-4.5,31.57-12.657,31.57-12.657Zm23.485,66.206-13.434,8.066-19.82-2.555s-38.325-2.366-45.554-.906a26.427,26.427,0,0,0-10.536,4.074s5.263,6.061,18.647,11.612,31.184,4.889,47.558-1.8S111.217,100.565,111.217,100.565Z"/>
            </g>
            </svg> */}
        </Container>
    );
}

export default YonderMainLogo;