import React from 'react';
import { Page, Document, Image, StyleSheet } from '@react-pdf/renderer';
import POTitle from './poTitle';
import BillTo from './BillTo';
import InvoiceNo from './InvoiceNo';
import InvoiceItemsTable from './InvoiceItemsTable';
import InvoiceThankYouMsg from './InvoiceThankYouMsg';
import POSellerAddress from './poSellerAddress';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 60,
        paddingRight: 60,
        lineHeight: 1.5,
        flexDirection: 'column',
    },
    logo: {
        width: 74,
        height: 66,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});

const Invoice = ({ invoice }: { invoice: any; }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <POTitle sellerCompany='The Reusability Company' />
            <POSellerAddress addressLine='3 Germany Dr, Unit 4' city='Wilmington' state='Delaware' zip='19804' country='USA' website='wwww.re.company' phoneNumber='+1 9295054562' />
            <InvoiceNo invoice={invoice} />
            <BillTo invoice={invoice} />
            <InvoiceItemsTable invoice={invoice} />
            <InvoiceThankYouMsg />
        </Page>
    </Document>
);

export default Invoice;