import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    billingInfoContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    textContainer: {
        flexDirection: 'column',
        lineHeight: 1.25,
    },
    heading: {
        color: '#000000',
        fontSize: 7,
        textTransform: 'uppercase',
    },
    body: {
        color: '#000000',
        fontSize: 8,
    }
});

const POBillingInfo = ({ sellerCompany, sellerAddressLine, sellerCity, sellerState, sellerZip, sellerCountry, sellerTaxId, sellerPONumber, buyerBillingAddressLine, buyerShippingAddressLine, buyerName, buyerPhone, buyerTaxId }: { sellerCompany: string; sellerAddressLine: string; sellerCity: string; sellerState: string; sellerZip: string; sellerCountry: string; sellerTaxId: string; sellerPONumber: number; buyerBillingAddressLine: string; buyerShippingAddressLine: string; buyerName: string; buyerPhone: string; buyerTaxId: number; }) => (
    <View style={styles.billingInfoContainer}>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>To:</Text>
            <Text style={styles.body}>{sellerCompany}</Text>
            <Text style={styles.body}>{sellerAddressLine}</Text>
            <Text style={styles.body}>{sellerCity}, {sellerState}</Text>
            <Text style={styles.body}>{sellerZip} {sellerCountry}</Text>
            <Text style={styles.body}>EIN: {sellerTaxId}</Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>From:</Text>
            <Text style={styles.body}>{buyerBillingAddressLine}</Text>
            <Text style={styles.body}>{buyerShippingAddressLine}</Text>
            <Text style={styles.body}>{buyerName}</Text>
            <Text style={styles.body}>{buyerPhone}</Text>
            <Text style={styles.body}>EIN: {buyerTaxId}</Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>P.O. NUMBER: </Text>
            <Text style={styles.body}>{sellerPONumber}</Text>
        </View>
    </View>
);

export default POBillingInfo;