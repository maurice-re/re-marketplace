import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        height: 18,
        fontStyle: 'bold',
        fontFamily: 'Helvetica',
        fontSize: 7,
        textTransform: 'uppercase',
        letterSpacing: 1,
        lineHeight: 1,
    },
    column: {
        width: '20%',
        borderRightColor: '#ffffff',
        borderRightWidth: 1,
        paddingLeft: 5,
    },
    lastColumn: {
        width: '20%',
        paddingLeft: 5,
    },

});

const POTermsTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.column}>P.O. Date</Text>
        <Text style={styles.column}>Requestioner</Text>
        <Text style={styles.column}>Shipped Via</Text>
        <Text style={styles.column}>F.O.B Point</Text>
        <Text style={styles.lastColumn}>Terms</Text>
    </View>
);

export default POTermsTableHeader;