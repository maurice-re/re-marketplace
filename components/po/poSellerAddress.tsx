import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    addressContainer: {
        flexDirection: 'column',
        marginTop: 10,
    },
    text: {
        color: '#000000',
        fontSize: 7,
        lineHeight: 1.3,
    }
});

const POSellerAddress = ({ sellerAddressLine, sellerCity, sellerState, sellerZip, sellerCountry, sellerWebsite, sellerPhone }: { sellerAddressLine: string; sellerCity: string; sellerState: string; sellerZip: string; sellerCountry: string; sellerWebsite: string; sellerPhone: string; }) => (
    <View style={styles.addressContainer}>
        <Text style={styles.text}>{sellerAddressLine}</Text>
        <Text style={styles.text}>{sellerCity}, {sellerState}</Text>
        <Text style={styles.text}>{sellerZip} {sellerCountry}</Text>
        <Text style={styles.text}>{sellerWebsite}</Text>
        <Text style={styles.text}>{sellerPhone}</Text>
    </View>
);

export default POSellerAddress;