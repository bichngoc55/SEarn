import React, {ReactNode} from "react";
import { View, ViewStyle, StyleSheet, StyleProp } from "react-native";

interface Props {
    children: ReactNode[];
    styles?: StyleProp<ViewStyle>;
}

const nameTab =(props: Props) =>{
    const {children, styles} =props;
    return(
        <View style={[
            styles,
            {flexDirection: 'column',
                padding: 8,
            },
        ]}>
            {children}
        </View>
    )
}

export default nameTab;