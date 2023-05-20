/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const { sendEMail ,generateCode, base64EncodeFile, getFileSize } = require('./mail');

const { BadRequest } = require('../tools/errors');
const AuditLogsWorker = require('../queues/workers/auditLogs/export');
const CSVFileParser = require('./CSVFileParser');
const database = require('./database');


const exportAuditLogs = async({
    dbQuery,
    dbValues,
    user
}) => {
    try {

        
        const headers = [
            'id',
            'client_ip',
            'req_method',
            'host',
            'path',
            'status_code',
            'client_agent',
            'response_message',
            'referer',
            'content_type',
            'content_encoding',
            'user_agent',
            'user_name',
            'user_email',
            'user_type',
            'user_id',
            'activity',
            'deleted_at',
            'created_at',
            'updated_at',
            ];

        const data = await database.query.any(dbQuery, dbValues);
        const csvPath = path.resolve(__dirname, '../../storage/auditLogs');
        const spaceKeyPath = 'exports/auditLogs';
        const fileName = `auditlogs-${generateCode()}.csv`;
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

        await AuditLogsWorker.sendExportedAuditLogs({
          file,
          user
      });
        return 'done';
    } catch (err) {
        throw BadRequest(err);
    }
};

const sendExportedAuditLogs = async({ file, user }) => {
    try {
        const base64Content = await base64EncodeFile(file.filePath);
        const fileSize = getFileSize(file.filePath);

        const exportAuditLogsTemplate = '../../views/emails/audit-logs-export.ejs'
      
        let mailPayload = {};
        if (base64Content !== '') {
            if (fileSize >= 20) {
                mailPayload = {
                    to:  user.email || 'akudevops@gmail.com',
                    from: config.get('notification.email.from_mail'),
                    bcc: [ 'akudevops@gmail.com '],
                    subject: 'Audit Logs Data Download',
                    filePath: exportAuditLogsTemplate,
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
                to:  user.email || 'akudevops@gmail.com',
                from: config.get('notification.email.from_mail'),
                subject: 'Audit Logs Data Download',
                bcc: [ 'akudevops@gmail.com' ],
                filePath: exportAuditLogsTemplate,
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
    exportAuditLogs,
    sendExportedAuditLogs,
};




// clear
