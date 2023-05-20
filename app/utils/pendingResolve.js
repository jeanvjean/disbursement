/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { sendEMail ,generateCode, base64EncodeFile, getFileSize } = require('./mail');

const { BadRequest } = require('../tools/errors');
const PendingResolveWorker = require('../queues/workers/pendingResolve/export');
const CSVFileParser = require('./CSVFileParser');
const database = require('./database');


const exportPendingResolve = async({
    dbQuery,
    dbValues,
    user
}) => {
    try {

        const headers = [
            'id',
            'phone_number',
            'message_content',
            'account_number',
            'bank_name',
            'account_name',
            'status',
            'account_resolved_by',
            'created_at',
            ];

        const data = await database.query.any(dbQuery, dbValues)

        const csvPath = path.resolve(__dirname, '../../storage/pendingResolve');
        const spaceKeyPath = 'exports/pendingResolve';
        const fileName = `pending-resolve-${generateCode()}.csv`;
        const filePath = path.resolve(__dirname, `${csvPath}/${fileName}`);
        
        const fileParser = new CSVFileParser(
          null,
          filePath,
          fileName
      );
      await fileParser.setHeader(headers);
      const dataArray = Array.isArray(data) ? data : [data];
      const fileStream = fileParser.createFileStream()
      dataArray.forEach(async(row) => {
        fileStream.writeStream(row);
      });
      fileParser.end()
        const file = {
          fileName : fileStream.fileName,
          filePath: fileStream.filePath,
          bucketUrl: await fileParser.getSpaceUploadPath(spaceKeyPath)
        };

        await PendingResolveWorker.sendExportedPendingResolve({
            file,
            user
        });
        return 'done';
    } catch (err) {
        throw BadRequest(err);
    }
};

const sendExportedPendingResolve = async({ file, user }) => {
    try {
        const base64Content = await base64EncodeFile(file.filePath);
        const fileSize = getFileSize(file.filePath);

        const templatePath = '../../views/emails/audit-logs-export.ejs'
      
        let mailPayload = {};
        if (base64Content !== '') {
            if (fileSize >= 20) {
                mailPayload = {
                    to:  user.email || 'akudevops@gmail.com',
                    from: config.get('notification.email.from_mail'),
                    bcc: [ 'akudevops@gmail.com' ],
                    subject: 'Pending Resolve Data Download',
                    filePath: templatePath,
                    payload: {
                        user,
                        file
                    },
                    attachment: false
                };

                await sendEMail({
                    ...mailPayload
                });
                fs.unlink(file.filePath, err => {
                  if (err) {
                        return err;
                  }
                });
                return 'done';
            }
        }

        if (base64Content !== '') {
            mailPayload = {
                to:   user.email || 'akudevops@gmail.com',
                from: config.get('notification.email.from_mail'),
                subject: 'Pending Resolve Data Download',
                bcc: [ 'akudevops@gmail.com' ],
                filePath: templatePath,
                payload: {
                    user,
                    file
                },
                attachment: true,
                fileName: file.fileName,
                fileType: 'text/csv',
                content: base64Content
            };

            await sendEMail({
                ...mailPayload
            });
            fs.unlink(file.filePath, err => {
              if (err) {
                  return err;
              }
          });
        }


        return 'done';
    } catch (err) {
        throw BadRequest({
            err
        });
    }
};


module.exports = {
    exportPendingResolve,
    sendExportedPendingResolve,
};

