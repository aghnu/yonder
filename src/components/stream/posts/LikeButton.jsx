/*
    props.action - onClick event
*/

import { LikeIcon } from "./postSVG";
import { Container } from "react-bulma-components";
import { color } from "../../profile/styling";


// local styling
var buttonStyle = {
    scale: "25",
    style: {
        fill: color.buttonRed,
    }
}

// component
function LikeButton(props) {
    return (
        <Container style={buttonStyle.style} class="likeButton">
            <a onClick={props.action}><LikeIcon svgScale={buttonStyle.scale} /></a>
        </Container>
    );
}

export default LikeButton;