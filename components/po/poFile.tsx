import React from 'react';
import { Page, Document, Image, StyleSheet } from '@react-pdf/renderer';
import POTitle from './poTitle';
import InvoiceItemsTable from './InvoiceItemsTable';
import POSellerAddress from './poSellerAddress';
import POBillingInfo from './poBillingInfo';

// The generation of the PO was based on this invoice example by Kagunda JM: https://kags.me.ke/post/generate-dynamic-pdf-incoice-using-react-pdf/

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

const POFile = ({ invoice }: { invoice: any; }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <POTitle sellerCompany='The Reusability Company' />
            <POSellerAddress addressLine='3 Germany Dr, Unit 4' city='Wilmington' state='Delaware' zip='19804' country='USA' website='wwww.re.company' phoneNumber='+1 9295054562' />
            <POBillingInfo sellerCompany="The Reusability Company" ein="87-2179396" addressLine='3 Germany Dr, Unit 4' city='Wilmington' state='Delaware' zip='19804' country='USA' poNumber={57} />
            <InvoiceItemsTable invoice={invoice} />
        </Page>
    </Document>
);

export default POFile;