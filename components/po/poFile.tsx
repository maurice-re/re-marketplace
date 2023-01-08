"use client";
import { Fragment } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Document, Image, StyleSheet } from '@react-pdf/renderer';
import POTitle from './poTitle';
import POTermsTable from './poTermsTable';
import POSellerAddress from './poSellerAddress';
import POBillingInfo from './poBillingInfo';
import { POItem, POTotal } from '../../app/po/pdf/page';
import POItemsTable from './poItemsTable';
import POItemsTotals from './poItemsTotals';

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

// TODO(Suhana): Need to take in all items and fields
function POFile({
    items,
    totals,
}: {
    items: POItem[];
    totals: POTotal[];
}) {
    return (
        <Fragment>
            <PDFViewer width="1000" height="600" className="app">
                <Document>
                    <Page size="A4" style={styles.page}>
                        <POTitle sellerCompany='The Reusability Company' />
                        <POSellerAddress sellerAddressLine='3 Germany Dr, Unit 4' sellerCity='Wilmington' sellerState='Delaware' sellerZip='19804' sellerCountry='USA' sellerWebsite='wwww.re.company' sellerPhone='+1 9295054562' />
                        <POBillingInfo sellerCompany="The Reusability Company" sellerTaxId="87-2179396" sellerAddressLine='3 Germany Dr, Unit 4' sellerCity='Wilmington' sellerState='Delaware' sellerZip='19804' sellerCountry='USA' sellerPONumber={57} buyerBillingAddressLine={"buyerBillingAddressLine"} buyerShippingAddressLine={"buyerShippingAddressLine"} buyerName={"buyerName"} buyerPhone={"buyerPhone"} buyerTaxId={0} />
                        <POTermsTable poDate="poDate" requestioner="requestioner" shippedVia="shippedVia" fobPoint="fobPoint" terms="terms" />
                        <POItemsTable items={items} totals={totals} />
                        <POItemsTotals totals={totals} />
                    </Page>
                </Document>
            </PDFViewer>
        </Fragment>
    );
}

export default POFile;
