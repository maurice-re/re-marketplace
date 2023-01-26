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

const date = new Date();
const POTermsTableRow = ({ requestioner, shippedVia, fobPoint, terms }: { requestioner: string; shippedVia: string; fobPoint: string; terms: string; }) => {
    function getValidatedEntry(entry: string) {
        // Optional fields => need to check for "" and replace to maintain formatting
        return entry === "" ? " " : entry;
    }
    return (<Fragment><View style={styles.row}>
        <Text style={styles.column}>{date.toDateString()}</Text>
        <Text style={styles.column}>{getValidatedEntry(requestioner)}</Text>
        <Text style={styles.column}>{getValidatedEntry(shippedVia)}</Text>
        <Text style={styles.column}>{getValidatedEntry(fobPoint)}</Text>
        <Text style={styles.lastColumn}>{getValidatedEntry(terms)}</Text>
    </View></Fragment>);
};

export default POTermsTableRow;