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
    qty: {
        width: '12.5%',
        borderRightColor: 'white',
        borderRightWidth: 1,
        paddingLeft: 5,
    },
    unit: {
        width: '12.5%',
        borderRightColor: 'white',
        borderRightWidth: 1,
        paddingLeft: 5,
    },
    description: {
        width: '50%',
        borderRightColor: 'white',
        borderRightWidth: 1,
        paddingLeft: 5,
    },
    unitPrice: {
        width: '12.5%',
        borderRightColor: 'white',
        borderRightWidth: 1,
        paddingLeft: 5,
    },
    total: {
        width: '12.5%',
        paddingLeft: 5,
    },

});

const POTermsTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.qty}>Qty</Text>
        <Text style={styles.unit}>Unit</Text>
        <Text style={styles.description}>Description</Text>
        <Text style={styles.unitPrice}>Unit Price</Text>
        <Text style={styles.total}>Total</Text>
    </View>
);

export default POTermsTableHeader;