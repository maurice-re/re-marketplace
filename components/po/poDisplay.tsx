"use client";
import { Fragment } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import invoice from '../../utils/po/template';
import Invoice from './poPDF';

function PODisplay() {
    return (
        <Fragment>
            <PDFViewer width="1000" height="600" className="app">
                <Invoice invoice={invoice} />
            </PDFViewer>
        </Fragment>
    );
}

export default PODisplay;
