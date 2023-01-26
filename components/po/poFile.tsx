"use client";
import { Fragment } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Document, StyleSheet } from '@react-pdf/renderer';
import POTitle from './poTitle';
import POTermsTable from './poTermsTable';
import POSellerAddress from './poSellerAddress';
import PODocumentInfo from './poDocumentInfo';
import { POItem, POTotal } from '../../app/po/pdf/page';
import POItemsTable from './poItemsTable';
import POItemsTotals from './poItemsTotals';
import POSignoff from './poSignoff';
import POPaymentInfo from './poPaymentInfo';

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

function POFile({
    items,
    totals,
    sellerCompany,
    sellerAddressLine,
    sellerCity,
    sellerState,
    sellerZip,
    sellerCountry,
    buyerCity,
    buyerState,
    buyerZip,
    buyerCountry,
    sellerWebsite,
    sellerPhone,
    sellerTaxId,
    poNumber,
    buyerPhone,
    buyerAddressLine,
    buyerCompany,
    shippedVia,
    requestioner,
    fobPoint,
    terms,
    sellerRoutingNumber,
    sellerAccountNumber,
    sellerBankName,
    sellerEmail,
    buyerEmail,
}: {
    items: POItem[];
    totals: POTotal[];
    sellerCompany: string;
    sellerAddressLine: string;
    sellerCity: string;
    sellerState: string;
    sellerZip: string;
    sellerCountry: string;
    buyerCity: string;
    buyerState: string;
    buyerZip: string;
    buyerCountry: string;
    sellerWebsite: string;
    sellerPhone: string;
    sellerTaxId: string;
    poNumber: number;
    buyerAddressLine: string;
    buyerCompany: string;
    buyerPhone: string;
    requestioner: string;
    shippedVia: string;
    fobPoint: string;
    terms: string;
    sellerRoutingNumber: number;
    sellerAccountNumber: number;
    sellerBankName: string;
    sellerEmail: string;
    buyerEmail: string;
}) {
    return (
        <Fragment>
            <PDFViewer width="1000" height="600" className="app">
                <Document>
                    <Page size="A4" style={styles.page}>
                        <POTitle sellerCompany={sellerCompany} />
                        <POSellerAddress sellerAddressLine={sellerAddressLine} sellerCity={sellerCity} sellerState={sellerState} sellerZip={sellerZip} sellerCountry={sellerCountry} sellerWebsite={sellerWebsite} sellerPhone={sellerPhone} />
                        <PODocumentInfo sellerCompany={sellerCompany} sellerAddressLine={sellerAddressLine} sellerCity={sellerCity} sellerState={sellerState} sellerZip={sellerZip} sellerCountry={sellerCountry} buyerCity={buyerCity} buyerState={buyerState} buyerZip={buyerZip} buyerCountry={buyerCountry} poNumber={poNumber} buyerAddressLine={buyerAddressLine} buyerCompany={buyerCompany} buyerPhone={buyerPhone} sellerEmail={sellerEmail} buyerEmail={buyerEmail} />
                        <POTermsTable requestioner={requestioner} shippedVia={shippedVia} fobPoint={fobPoint} terms={terms} />
                        <POItemsTable items={items} />
                        <POItemsTotals totals={totals} />
                        <POPaymentInfo sellerAccountNumber={sellerAccountNumber} sellerRoutingNumber={sellerRoutingNumber} sellerBankName={sellerBankName} sellerTaxId={sellerTaxId} />
                        <POSignoff />
                    </Page>
                </Document>
            </PDFViewer>
        </Fragment>
    );
}

export default POFile;
