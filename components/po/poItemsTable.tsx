import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import POItemsTableHeader from './poItemsTableHeader';
import POItemsTableRows from './poItemsTableRows';
import { POItem, POTotal } from '../../app/po/pdf/page';
import POItemsTotals from './poItemsTotals';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
});

const POItemsTable = ({ items, totals }: { items: POItem[]; totals: POTotal[]; }) => (
    <View style={styles.tableContainer}>
        <POItemsTableHeader />
        <POItemsTableRows items={items} />
    </View>
);

export default POItemsTable;