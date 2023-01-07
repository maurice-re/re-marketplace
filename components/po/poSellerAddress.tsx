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
    }
});

const POSellerAddress = ({ addressLine, city, state, zip, country, website, phone }: { addressLine: string; city: string; state: string; zip: string; country: string; website: string; phone: string; }) => (
    <View style={styles.addressContainer}>
        <Text style={styles.text}>{addressLine}</Text>
        <Text style={styles.text}>{city}, {state}</Text>
        <Text style={styles.text}>{zip} {country}</Text>
        <Text style={styles.text}>{phone}</Text>
    </View>
);

export default POSellerAddress;