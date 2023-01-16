import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        marginTop: 40,
        justifyContent: 'space-between',
    },
    company: {
        color: '#000000',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: 'bold'
    },
    reportTitle: {
        color: '#a3a3a3',
        letterSpacing: 2,
        fontSize: 14,
        textTransform: 'uppercase',
    }
});

const POTitle = ({ sellerCompany }: { sellerCompany: string; }) => (
    <View style={styles.titleContainer}>
        <Text style={styles.company}>{sellerCompany}</Text>
        <Text style={styles.reportTitle}>Purchase Order</Text>
    </View>
);

export default POTitle;