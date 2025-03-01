import { PulseLoader } from "react-spinners";

const LoadingDots = () => {
    return (
        <div className="">
            <PulseLoader
                color="#00bcff"
                margin={2}
                size={5}
            />
        </div>
    );
};

export default LoadingDots;
