import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

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
    column: {
        width: '20%',
        borderRightColor: '#e0e0e0',
        borderRightWidth: 1,
        paddingLeft: 5,
    },
    lastColumn: {
        width: '20%',
        paddingLeft: 5,
    },

});

const POTermsTableRow = ({ poDate, requestioner, shippedVia, fobPoint, terms }: { poDate: string; requestioner: string; shippedVia: string; fobPoint: string; terms: string; }) => {
    return (<Fragment><View style={styles.row}>
        <Text style={styles.column}>{poDate}</Text>
        <Text style={styles.column}>{requestioner}</Text>
        <Text style={styles.column}>{shippedVia}</Text>
        <Text style={styles.column}>{fobPoint}</Text>
        <Text style={styles.lastColumn}>{terms}</Text>
    </View></Fragment>);
};

export default POTermsTableRow;
