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

const POBillingInfo = ({ sellerCompany, addressLine, city, state, zip, country, ein, poNumber }: { sellerCompany: string; addressLine: string; city: string; state: string; zip: string; country: string; ein: string; poNumber: number; }) => (
    <View style={styles.billingInfoContainer}>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>To:</Text>
            <Text style={styles.body}>{sellerCompany}</Text>
            <Text style={styles.body}>{addressLine}</Text>
            <Text style={styles.body}>{city}, {state}</Text>
            <Text style={styles.body}>{zip} {country}</Text>
            <Text style={styles.body}>EIN: {ein}</Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>From:</Text>
            <Text style={styles.body}>[Info]</Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>P.O. NUMBER: </Text>
            <Text style={styles.body}>{poNumber}</Text>
        </View>
    </View>
);

export default POBillingInfo;