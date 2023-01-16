import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import POItemsTableHeader from './poItemsTableHeader';
import POItemsTableRows from './poItemsTableRows';
import { POItem } from '../../app/po/pdf/page';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: '#e0e0e0',
    },
});

const POItemsTable = ({ items }: { items: POItem[]; }) => (
    <View style={styles.tableContainer}>
        <POItemsTableHeader />
        <POItemsTableRows items={items} />
    </View>
);

export default POItemsTable;