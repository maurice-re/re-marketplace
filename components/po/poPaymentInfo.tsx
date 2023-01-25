import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    billingInfoContainer: {
        flexDirection: 'row',
        marginTop: 40,
    },
    textContainer: {
        flexDirection: 'column',
        lineHeight: 1.25,
        fontSize: 9,
    },
    heading: {
        color: '#000000',
        letterSpacing: 0.75,
        textTransform: 'uppercase',
    },
    body: {
        color: '#000000',
    }
});

// Display information like To, From, and  involved
const POPaymentInfo = ({ sellerBankName, sellerAccountNumber, sellerRoutingNumber, sellerTaxId }: { sellerBankName: string; sellerAccountNumber: number; sellerRoutingNumber: number; sellerTaxId: string; }) => (
    <View style={styles.billingInfoContainer}>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>Payment Details:</Text>
            <Text style={styles.body}>Bank Name: {sellerBankName}</Text>
            <Text style={styles.body}>Account Number: {sellerAccountNumber}</Text>
            <Text style={styles.body}>Routing Number: {sellerRoutingNumber}</Text>
            <Text style={styles.body}>EIN: {sellerTaxId}</Text>
        </View>
    </View>
);

export default POPaymentInfo;