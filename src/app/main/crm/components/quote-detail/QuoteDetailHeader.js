/* eslint-disable new-cap */
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useEffect, useRef, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import {
  selectHasUpdatedTable,
  selectHasUpdatedTerms,
  selectUsers,
  setHasUpdatedTable,
  updateQuote,
} from '../../store/quotesSlice';
import { selectItems } from '../../store/itemsSlice';
import { selectCompanyProfile } from 'src/app/main/settings/users/store/settingsSlice';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function QuoteDetailHeader({
  quote,
  table,
  stage,
  handleSubmit,
  convertedContent,
  isValid,
  dirtyFields,
}) {
  const company = useSelector(selectCompanyProfile);
  console.log({ company });

  const hasUpdatedTerms = useSelector(selectHasUpdatedTerms);
  const [open, setOpen] = useState(false);
  const items = useSelector(selectItems);
  const users = useSelector(selectUsers);
  const hasUpdatedTable = useSelector(selectHasUpdatedTable);

  const dispatch = useDispatch();

  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const onSubmit = (formData) => {
    const items = table.getRowModel().rows.reduce((acc, rowEl) => {
      if (rowEl.original.createdAt) {
        acc.push({
          ...rowEl._valuesCache,
          createdAt: rowEl.original.createdAt,
        });
      }
      return acc;
    }, []);

    dispatch(
      updateQuote({
        ...formData,
        customer: undefined,
        customerId: formData.customer._id,
        paymentTerms: convertedContent,
        stage,
        items,
      })
    ).then((action) => {
      if (action.error) {
        dispatch(
          showMessage({
            message: 'An Error Occured while Updating',
            variant: 'error',
          })
        );
      } else {
        dispatch(
          showMessage({
            message: 'Quote Updated Successfully',
            variant: 'success',
          })
        );
        dispatch(setHasUpdatedTable(false));
      }
    });
  };

  const downloadPdf = () => {
    const quoteTitle = quote.title.toUpperCase();
    const preparedBy = users.find((user) => user._id === quote.stage[0].value);
    const approvedBy = users.find((user) => user._id === quote.stage[2].value);

    const tableBody = quote.items.map((obj) => {
      const colSpan = obj.bold ? 6 : 1;
      return [
        {
          text: obj.serviceName || '',
          margin: [8, 5, 0, 5],
          border: [true, true, true, true],
        },
        {
          text:
            colSpan > 1 ? obj.description.toUpperCase() : obj.description || '',
          margin: [0, 5, 0, 5],
          colSpan,
          bold: obj.bold,
          border: [true, true, true, true],
        },
        {
          text: obj.range || '',
          margin: [0, 5, 0, 5],
          border: [true, true, true, true],
        },
        {
          text: obj.standard || '',
          margin: [0, 5, 0, 5],
          border: [true, true, true, true],
        },

        {
          text:
            quote.showPrice === 'Yes'
              ? `${quote.currency.name} ${obj.price}` || ''
              : '',
          margin: [0, 5, 0, 5],
          border: [true, true, true, true],
        },
        {
          text: obj.quantity || '',
          margin: [0, 5, 0, 5],
          border: [true, true, true, true],
        },
        {
          text: `${quote.currency.name} ${obj.total}` || '',
          margin: [0, 5, 0, 5],
          border: [true, true, true, true],
        },
      ];
    });
    const definitions = htmlToPdfmake(quote.paymentTerms, {
      defaultStyles: {
        p: {
          fontSize: 11,
          margin: [0, 2, 0, 2],
        },
      },
    });

    const body = [
      [
        {
          text: 'Service',
          fillColor: '#1F1F1F',
          color: '#ffffff',
          margin: [8, 5, 0, 5],
        },
        {
          text: 'Description',
          fillColor: '#1F1F1F',
          color: '#ffffff',
          margin: [0, 5, 0, 5],
          // border: [true, true, true, true],
        },
        {
          text: 'Range',
          fillColor: '#1F1F1F',
          color: '#ffffff',
          margin: [0, 5, 0, 5],
        },
        {
          text: 'Standard',
          fillColor: '#1F1F1F',
          color: '#ffffff',
          margin: [0, 5, 0, 5],
        },
        {
          text: 'Price',
          fillColor: '#1F1F1F',
          color: '#ffffff',
          margin: [0, 5, 0, 5],
        },
        {
          text: 'Quantity',
          fillColor: '#1F1F1F',
          color: '#ffffff',
          margin: [0, 5, 0, 5],
        },
        {
          text: 'Total',
          fillColor: '#1F1F1F',
          color: '#ffffff',
          margin: [0, 5, 0, 5],
        },
      ],
      ...tableBody,
      quote.showTotal === 'Yes'
        ? [
            {
              text: 'Subtotal',
              fontSize: 14,
              colSpan: 3,
              alignment: 'right',
              margin: [0, 15, 0, 15],
            },
            '',
            '',
            {
              text: `${quote.currency.name} ${quote.subTotal.toLocaleString()}`,
              fontSize: 16,
              colSpan: 4,
              alignment: 'right',
              margin: [0, 15, 0, 15],
            },
            '',
            '',
            '',
          ]
        : [],
      quote.showTotal === 'Yes'
        ? [
            {
              text: 'Vat(%)',
              fontSize: 14,
              colSpan: 3,
              alignment: 'right',
              margin: [0, 15, 0, 15],
            },
            '',
            '',
            {
              text: `${quote.vat}%`,
              fontSize: 16,
              colSpan: 4,
              alignment: 'right',
              margin: [0, 15, 0, 15],
            },
            '',
            '',
            '',
          ]
        : [],
      quote.showTotal === 'Yes'
        ? [
            {
              text: 'Discount',
              fontSize: 14,
              colSpan: 3,
              alignment: 'right',
              margin: [0, 15, 0, 15],
            },
            '',
            '',
            {
              text: `${quote.discount}%`,
              fontSize: 16,
              colSpan: 4,
              alignment: 'right',
              margin: [0, 15, 0, 15],
            },
            '',
            '',
            '',
          ]
        : [],
      quote.showTotal === 'Yes'
        ? [
            {
              text: 'Total',
              fontSize: 20,
              colSpan: 3,
              bold: true,
              alignment: 'right',
              margin: [0, 15, 0, 15],
              borders: [true, true, true, true],
            },
            '',
            '',
            {
              text: `${quote.currency.name} ${quote.total.toLocaleString()}`,
              fontSize: 20,
              colSpan: 4,
              bold: true,
              alignment: 'right',
              margin: [0, 15, 0, 15],
            },
            '',
            '',
            '',
          ]
        : [],
    ].filter((array) => array.length > 0);

    const docDefinition = {
      pageMargins: [40, 100, 40, 60],
      footer(currentPage, pageCount) {
        return {
          text: `${currentPage.toString()} of ${pageCount}`,
          alignment: 'center',
        };
      },
      images: {
        snow: `${process.env.REACT_APP_BASE_BACKEND}${company.logo}`,
        //banner: `${process.env.REACT_APP_BASE_BACKEND}/images/mudiame-quote-banner.png`,
      },
      header(currentPage, pageSize) {
        return [
          {
            columns: [
              {
                image: 'snow',
                width: 40,
                height: 40,
                margin: [40, 20],
              },
              {
                stack: [
                  {
                    text: 'Mudiame International Limited',
                    fontSize: 10,
                    bold: true,
                  },
                  'Plot 105, Igbo Etche Road',
                  'Opposite Enerco Rumuokwurusi',
                  'Port Harcourt, Rivers State, Nigeria',
                ],
                fontSize: 10,
                margin: [60, 20],
              },
              {
                stack: [
                  {
                    text: 'Mudiame International Limited',
                    fontSize: 10,
                    bold: true,
                  },
                  'Tel: +234(0)810 356 7175',
                  'Email: info@mudiame.com',
                  'nigeria.mudiame02@yahoo.com',
                  'Website: www.mudiame.com',
                ],
                fontSize: 10,
                margin: [0, 20],
              },
            ],
            canvas: [
              { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
            ],
          },
        ];
      },
      content: [
        { text: 'Quotation', bold: true, alignment: 'right', fontSize: 18 },
        {
          columns: [
            {
              stack: ['Your ref', `Quotation No: ${quote.quoteNo}`],
              fontSize: 10,
              alignment: 'left',
              bold: true,
            },
            {
              stack: ['Rev: 0', `${new Date(quote.quoteDate).toDateString()}`],
              fontSize: 10,
              alignment: 'right',
              bold: true,
            },
          ],
          margin: [0, 10],
        },
        {
          stack: [
            { text: 'Client', bold: true },
            { text: `${quote.customer.name.toUpperCase()},`, bold: true },
            { text: `${quote.customer.address},` },
            { text: `${quote.customer.city},` },
            { text: `${quote.customer.country}.` },
          ],
          lineHeight: 1.3,
        },
        // {
        //   image: 'banner',
        //   width: 520,
        //   height: 100,
        //   margin: [0, 20],
        // },
        {
          text: `Subject: ${quoteTitle}`,
          margin: [0, 5],
          bold: true,
        },
        {
          margin: [0, 300],
          columns: [
            {
              stack: [
                { text: 'Prepared By: ', bold: true },
                `${preparedBy?.firstName || ''} ${preparedBy?.lastName || ''}`,
              ],
            },
            {
              stack: [
                { text: 'Approved By: ', bold: true },
                `${approvedBy?.firstName || ''} ${approvedBy?.lastName || ''}`,
              ],
              margin: [150, 0, 0, 0],
            },
          ],
          pageBreak: 'after',
        },
        /* Table */
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [60, '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body,
          },
          layout: {
            hLineStyle(i, node) {
              if (i === 0 || i === node.table.body.length) {
                return null;
              }
              return '#1F1F1F';
            },
            vLineStyle(i, node) {
              if (i === 0 || i === node.table.widths.length) {
                return null;
              }
              return '#1F1F1F';
            },
          },
          pageBreak: 'after',
        },
        /* Payment Terms */
        {
          text: 'Payment Terms',
          bold: true,
          fontSize: 18,
          margin: [0, 5, 0, 10],
        },

        definitions,
        /* Condition of Services */
        {
          text: 'Condition of Services',
          bold: true,
          fontSize: 18,
          margin: [0, 5, 0, 10],
          pageBreak: 'before',
        },
        {
          text: 'The standard Conditions of Contract attached hereto ("the Conditions") will apply to any Services carried out in terms of this Quotation. Notwithstanding any other terms and conditions referred to in any further correspondence/documentation received from the Client, neither (1) any further correspondence subsequent to this Quotation,nor (2) performance of the Services, shall under any circumstance be construed as an acceptance of those terms and conditions. Acceptance of any provision other than the terms of this Quotation or the Conditions shall be made expressly in writting signed by the parties.',
          fontSize: 11,
          lineHeight: 1.2,
        },
        {
          text: 'We trust that you find the above to be acceptable; however, should you require any further information please do not hesitate to contact us at any time. Yours sincerely For and on behalf of Mudiame International Limited',
          margin: [0, 10, 0, 0],
          fontSize: 11,
          lineHeight: 1.2,
        },
        {
          text: 'By signning below, the Client agrees that it has read there terms of this Quotation and Conditions (together the "Contract") and will be bound to comply with the Contract with effect from the date of signature below:',
          margin: [0, 10, 0, 0],
          fontSize: 11,
          lineHeight: 1.2,
        },
        {
          text: 'Notwithstanding any terms and conditions which may have been supplied with or referenced in your order or subsequent correspondence, this Contract is not intended to accept, and shall not be construed as an acceptance by Mudiame Internationla Limitedof, any of those terms and conditions. We value the opportunity to perform the services requested by you and confirm that any work undertaken for you by us shall exprelly be undertaken subject to the Conditions.',
          margin: [0, 10, 0, 0],
          fontSize: 11,
          lineHeight: 1.2,
        },
      ],
    };
    pdfMake.createPdf(docDefinition).download();
  };

  return (
    <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
      <div className="flex gap-5 items-center space-y-8 sm:space-y-0">
        <motion.div
          className=""
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
        >
          <div className="flex flex-col items-start space-y-8">
            <Typography
              className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
              role="button"
            >
              Quote
            </Typography>
            <Typography
              className="text-16 md:text-[24] tracking-tight leading-none"
              role="button"
            >
              {quote?.title}
            </Typography>
          </div>
        </motion.div>
      </div>
      <div>
        <motion.div
          className="flex  w-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
        >
          <>
            <Button
              className="whitespace-nowrap mx-4"
              variant="contained"
              color="success"
              // eslint-disable-next-line no-undef
              disabled={
                !hasUpdatedTerms &&
                !hasUpdatedTable &&
                (_.isEmpty(dirtyFields) || !isValid)
              }
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
            <Button
              className="whitespace-nowrap mx-4"
              variant="contained"
              color="secondary"
              onClick={() => downloadPdf()}
            >
              Download Pdf
            </Button>
          </>
        </motion.div>
      </div>
    </div>
  );
}
