import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import POItemsTableHeader from './poItemsTableHeader';
import POItemsTableRows from './poItemsTableRows';
import { POItem } from '../../app/po/pdf/page';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 40,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
});

const POItemsTable = ({ items, total }: { items: POItem[]; total: number; }) => (
    <View style={styles.tableContainer}>
        <POItemsTableHeader />
        <POItemsTableRows items={items} />
    </View>
);

export default POItemsTable;