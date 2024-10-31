import React, { useState } from "react";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from "docx";
import { saveAs } from "file-saver";

const ExportInvoice = ({ orderDetails }) => {
  const handleExportDocx = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Hóa đơn cho Mã đơn hàng: ${orderDetails._id}`,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun(`Tên người dùng: ${orderDetails.username}`),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(`Điện thoại: ${orderDetails.phone}`),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(`Email: ${orderDetails.email}`),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(`Địa chỉ: ${orderDetails.address}`),
              ],
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun("Đặt hàng các mặt hàng:"),
              ],
              bold: true,
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Sản phẩm")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Số lượng")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Giá")],
                    }),
                  ],
                }),
                ...orderDetails.items.map((item) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(item.product.name)],
                      }),
                      new TableCell({
                        children: [new Paragraph(`${item.quantity}`)],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price)
                          ),
                        ],
                      }),
                    ],
                  })
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Total: ${new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(orderDetails.total)}`,
                  bold: true,
                }),
              ],
              spacing: { before: 400 },
            }),
          ],
        },
      ],
    });

    // Lưu file
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `invoice_${orderDetails._id}.docx`);
    });
  };

  return (
    <button onClick={handleExportDocx} className="btn btn-primary">
      Xuất hóa đơn sang DOCX
    </button>
  );
};

export default ExportInvoice;
