import React from 'react';
import { CirclesWithBar } from 'react-loader-spinner';

const Loading = ({ show }) => {
    if (!show) return null; // Don't render if not needed

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                color:"#4fa94d",
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
                backdropFilter: 'blur(8px)', // Apply blur effect
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000, // Ensure it overlays everything
            }}
        >
            <CirclesWithBar
                height="100"
                width="100"
                color="#4fa94d"
                outerCircleColor="#4fa94d"
                innerCircleColor="#4fa94d"
                barColor="#4fa94d"
                ariaLabel="circles-with-bar-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
};

export default Loading;
