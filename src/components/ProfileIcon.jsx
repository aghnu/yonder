import { Container } from "react-bulma-components";

var iconStyling = {
    scale: "25",
    style: {
        padding: "0.5em",
        fill: "#BFBFBF",
    }
}

function ProfileIcon() {
    // a placeholder
    return (
        <Container style={iconStyling.style}>
            <svg id="_747376" data-name="747376" xmlns="http://www.w3.org/2000/svg" width={iconStyling.scale} height="5auto" viewBox="0 0 59.006 59.006">
            <g id="Group_41" data-name="Group 41" transform="translate(0)">
                <path id="Path_103" data-name="Path 103" class="cls-1" d="M50.365,38.144a29.39,29.39,0,0,0-11.211-7.032,17.057,17.057,0,1,0-19.3,0A29.55,29.55,0,0,0,0,59.006H4.61a24.893,24.893,0,1,1,49.787,0h4.61A29.311,29.311,0,0,0,50.365,38.144ZM29.5,29.5A12.447,12.447,0,1,1,41.95,17.057,12.461,12.461,0,0,1,29.5,29.5Z" transform="translate(0)"/>
            </g>
            </svg>
        </Container>
    );
}

export default ProfileIcon;