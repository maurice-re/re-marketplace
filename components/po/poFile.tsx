"use client";
import { Fragment } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Document, StyleSheet } from '@react-pdf/renderer';
import POTitle from './poTitle';
import POTermsTable from './poTermsTable';
import POSellerAddress from './poSellerAddress';
import POBillingInfo from './poBillingInfo';
import { POItem, POTotal } from '../../app/po/pdf/page';
import POItemsTable from './poItemsTable';
import POItemsTotals from './poItemsTotals';
import POSignoff from './poSignoff';

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
    }
});

// TODO(Suhana): Need to take in all items and fields
function POFile({
    items,
    totals,
    sellerCompany,
    sellerAddressLine,
    sellerCity,
    sellerState,
    sellerZip,
    sellerCountry,
    sellerWebsite,
    sellerPhone,
    sellerTaxId,
    sellerPONumber,
    buyerPhone,
    buyerBillingAddressLine,
    buyerTaxId,
    buyerName,
    shippedVia,
    requestioner,
    fobPoint,
    terms,
    routingNumber,
    accountNumber
}: {
    items: POItem[];
    totals: POTotal[];
    sellerCompany: string;
    sellerAddressLine: string;
    sellerCity: string;
    sellerState: string;
    sellerZip: string;
    sellerCountry: string;
    sellerWebsite: string;
    sellerPhone: string;
    sellerTaxId: string;
    sellerPONumber: number;
    buyerBillingAddressLine: string;
    buyerShippingAddressLine: string;
    buyerName: string;
    buyerPhone: string;
    buyerTaxId: number;
    requestioner: string;
    shippedVia: string;
    fobPoint: string;
    terms: string;
    routingNumber: string;
    accountNumber: string;
}) {
    // TODO(Suhana): Put new props in the PDF
    return (
        <Fragment>
            <PDFViewer width="1000" height="600" className="app">
                <Document>
                    <Page size="A4" style={styles.page}>
                        <POTitle sellerCompany={sellerCompany} />
                        <POSellerAddress sellerAddressLine={sellerAddressLine} sellerCity={sellerCity} sellerState={sellerState} sellerZip={sellerZip} sellerCountry={sellerCountry} sellerWebsite={sellerWebsite} sellerPhone={sellerPhone} />
                        <POBillingInfo sellerCompany={sellerCompany} sellerTaxId={sellerTaxId} sellerAddressLine={sellerAddressLine} sellerCity={sellerCity} sellerState={sellerState} sellerZip={sellerZip} sellerCountry={sellerCountry} sellerPONumber={sellerPONumber} buyerBillingAddressLine={"buyerBillingAddressLine"} buyerShippingAddressLine={buyerBillingAddressLine} buyerName={buyerName} buyerPhone={buyerPhone} buyerTaxId={buyerTaxId} />
                        <POTermsTable requestioner={requestioner} shippedVia={shippedVia} fobPoint={fobPoint} terms={terms} />
                        <POItemsTable items={items} />
                        <POItemsTotals totals={totals} />
                        <POSignoff />
                    </Page>
                </Document>
            </PDFViewer>
        </Fragment>
    );
}

export default POFile;
