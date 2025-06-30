import React from "react";
import styled from "styled-components";

export const LoaderTable = () => {
    return (
        <StyledWrapper>
            <div className="loaderRectangle">
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .loaderRectangle {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0 3px;
    }

    .loaderRectangle div {
        width: 6px;
        height: 5px;
        animation: 0.9s ease-in-out infinite;
        background: #0165b9;
        box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
    }

    .loaderRectangle div:nth-child(1) {
        animation-name: rectangleOneAnim;
        animation-delay: 1s;
    }

    @keyframes rectangleOneAnim {
        0% {
            height: 5px;
        }

        40% {
            height: 8px;
        }

        100% {
            height: 5px;
        }
    }

    .loaderRectangle div:nth-child(2) {
        animation-name: rectangleTwoAnim;
        animation-delay: 1.1s;
    }

    @keyframes rectangleTwoAnim {
        0% {
            height: 5px;
        }

        40% {
            height: 12px;
        }

        100% {
            height: 5px;
        }
    }

    .loaderRectangle div:nth-child(3) {
        animation-name: rectangleThreeAnim;
        animation-delay: 1.2s;
    }

    @keyframes rectangleThreeAnim {
        0% {
            height: 5px;
        }

        40% {
            height: 18px;
        }

        100% {
            height: 5px;
        }
    }

    .loaderRectangle div:nth-child(4) {
        animation-name: rectangleFourAnim;
        animation-delay: 1.3s;
    }

    @keyframes rectangleFourAnim {
        0% {
            height: 5px;
        }

        40% {
            height: 12px;
        }

        100% {
            height: 5px;
        }
    }

    .loaderRectangle div:nth-child(5) {
        animation-name: rectangleFiveAnim;
        animation-delay: 1.4s;
    }

    @keyframes rectangleFiveAnim {
        0% {
            height: 5px;
        }

        40% {
            height: 8px;
        }

        100% {
            height: 5px;
        }
    }
`;
