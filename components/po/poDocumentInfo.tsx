import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    billingInfoContainer: {
        flexDirection: 'row',
        marginTop: 40,
        justifyContent: 'space-between',
    },
    textContainer: {
        flexDirection: 'column',
        lineHeight: 1.25,
        fontSize: 7,
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
const PODocumentInfo = ({ sellerCompany, sellerAddressLine, sellerCity, sellerState, sellerZip, sellerCountry, buyerCity, buyerState, buyerZip, buyerCountry, poNumber, buyerAddressLine, buyerCompany, buyerPhone, sellerEmail, buyerEmail }: { sellerCompany: string; sellerAddressLine: string; sellerCity: string; sellerState: string; sellerZip: string; sellerCountry: string; buyerCity: string; buyerState: string; buyerZip: string; buyerCountry: string; poNumber: number; buyerAddressLine: string; buyerCompany: string; buyerPhone: string; sellerEmail: string; buyerEmail: string; }) => (
    <View style={styles.billingInfoContainer}>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>Bill From:</Text>
            <Text style={styles.body}>{sellerCompany}</Text>
            <Text style={styles.body}>{sellerAddressLine}</Text>
            <Text style={styles.body}>{sellerCity}, {sellerState}</Text>
            <Text style={styles.body}>{sellerZip} {sellerCountry}</Text>
            <Text style={styles.body}>{sellerEmail}</Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>Bill To:</Text>
            <Text style={styles.body}>{buyerCompany}</Text>
            <Text style={styles.body}>{buyerAddressLine}</Text>
            <Text style={styles.body}>{buyerCity}, {buyerState}</Text>
            <Text style={styles.body}>{buyerZip} {buyerCountry}</Text>
            <Text style={styles.body}>{buyerPhone}</Text>
            <Text style={styles.body}>{buyerEmail}</Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>P.O. NUMBER: </Text>
            <Text style={styles.body}>{poNumber}</Text>
        </View>
    </View>
);

export default PODocumentInfo;