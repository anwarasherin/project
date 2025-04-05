import { MdLocalParking } from "react-icons/md";
import { cn } from "../../../utils";

const Logo = ({ className }) => {
  return (
    <MdLocalParking
      className={cn(
        "bg-blue-500 text-white text-4xl p-1 rounded-lg",
        className
      )}
    />
  );
};

export default Logo;
