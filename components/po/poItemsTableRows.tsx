import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { POItem } from '../../app/po/pdf/page';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#e0e0e0',
        alignItems: 'center',
        height: 18,
        fontStyle: 'bold',
        fontFamily: 'Helvetica',
        fontSize: 7,
        lineHeight: 1,
    },
    qty: {
        width: '12.5%',
        borderRightColor: '#e0e0e0',
        borderRightWidth: 1,
        paddingLeft: 5,
    },
    unit: {
        width: '12.5%',
        borderRightColor: '#e0e0e0',
        borderRightWidth: 1,
        paddingLeft: 5,
    },
    description: {
        width: '50%',
        borderRightColor: '#e0e0e0',
        borderRightWidth: 1,
        paddingLeft: 5,
    },
    unitPrice: {
        width: '12.5%',
        borderRightColor: '#e0e0e0',
        borderRightWidth: 1,
        paddingLeft: 5,
    },
    total: {
        width: '12.5%',
        paddingLeft: 5,
    },

});

const POTermsTableRow = ({ items }: { items: POItem[]; }) => {
    const rows = items.map((item) => (
        <View style={styles.row}>
            <Text style={styles.qty}>{item.qty}</Text>
            <Text style={styles.unit}>{item.unit}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.unitPrice}>{item.unitPrice}</Text>
            <Text style={styles.total}>{item.total}</Text>
        </View>
    ));
    return (
        <Fragment>{rows}
        </Fragment>
    );
};

export default POTermsTableRow;
