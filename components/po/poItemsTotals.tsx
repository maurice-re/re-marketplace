import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { POItem, POTotal } from '../../app/po/pdf/page';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 18,
        fontStyle: 'bold',
        fontFamily: 'Helvetica',
        fontSize: 7,
        lineHeight: 1,
        width: '35%',
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
        borderLeftWidth: 1,
        borderLeftColor: '#e0e0e0',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    name: {
        width: '75%',
        borderRightColor: '#e0e0e0',
        borderRightWidth: 1,
        paddingLeft: 5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    value: {
        width: '25%',
        paddingLeft: 5,
    },

});

// TODO(Suhana): Style this better
const POItemsTotals = ({ totals }: { totals: POTotal[]; }) => {
    const rows = totals.map((total) => (
        <View style={styles.row}>
            <Text style={styles.name}>{total.name}</Text>
            <Text style={styles.value}>{total.value}</Text>
        </View>
    ));
    return (
        <Fragment>{rows}
        </Fragment>
    );
};

export default POItemsTotals;
