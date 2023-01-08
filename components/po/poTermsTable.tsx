import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import POTermsTableHeader from './poTermsTableHeader';
import POTermsTableRow from './poTermsTableRow';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 40,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
});

const POTermsTable = ({ poDate, requestioner, shippedVia, fobPoint, terms }: { poDate: string; requestioner: string; shippedVia: string; fobPoint: string; terms: string; }) => (
    <View style={styles.tableContainer}>
        <POTermsTableHeader />
        <POTermsTableRow poDate={poDate} requestioner={requestioner} shippedVia={shippedVia} fobPoint={fobPoint} terms={terms} />
    </View>
);

export default POTermsTable;