
import { StyleSheet, Text, View, Image } from 'react-native';
export default function Weather(){
    return(
        <View>
            <Text style={styles.topContainer}>Today's weather</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    topContainer: {
        fontSize: 30,
        paddingBottom: 100,
        // align item to top
        flexDirection: 'column',
    }
})