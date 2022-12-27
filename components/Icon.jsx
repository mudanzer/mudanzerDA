import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

const Icon = (props) => {
    const { size, style, name, color } = props;
    return (
        <Ionicons
            color={color}
            size={size ?? 22}
            style={[{ marginBottom: -3 }, style]}
            name={name}
        />
    );
}

export default Icon;