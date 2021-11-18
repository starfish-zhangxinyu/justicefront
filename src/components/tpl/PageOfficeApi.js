/*
 * @Description: PageOffice相关的一些公用方法
 * @Author: Simon
 * @LastEditors: Please set LastEditors
 * @Date: 2019-09-18
 */
import api from '../../api/index'
import { post } from '../../api/http'

export default class PageOfficeApi {
    /**
     * 打开文档。
     *
     * @param filePath
     * @param canSave 是否可以保存：Y或N
     */
    static openDoc(filePath, canSave) {
        var request = {
            poHandleType: 'OPEN_DOC',
            filePath: filePath,
            canSave: canSave
        }
        PageOfficeApi._genPageLink(request);
    }

    /**
     * 表单渲染
     *
     * @param url
     * @param data
     * @param callback
     */
    static renderForm(caseId, sampleId, templateId, isReCreate) {
        var request = {
            poHandleType: 'FORM_RENDER',
            caseId: caseId,
            sampleId: sampleId,
            template: {
                id: templateId
            },
            isReCreate: isReCreate
        }
        PageOfficeApi._genPageLink(request);
    }

    /**
     * 表单批量渲染
     *
     * @param url
     * @param data
     * @param callback
     */
    static renderForm1(caseId, filePath, isReCreate) {
        var request = {
            poHandleType: 'FORM_RENDER',
            caseId: caseId,
            filePath: filePath,
            isReCreate: isReCreate
        }
        PageOfficeApi._genPageLink(request);
    }

    /**
     * 报告制作
     *
     * @param url
     * @param data
     * @param callback
     */
    static reportMake(caseId, templateId, taskId, photo, sign) {
        var request = {
            poHandleType: 'REPORT_MAKE',
            caseId: caseId,
            taskId: taskId,
            template: {
                id: templateId
            },
            imageList: photo,
            showPhotoRemark: sign
        }
        PageOfficeApi._genPageLink(request);
    }

    /**
     * 报告制作
     *
     * @param url
     * @param data
     * @param callback
     */
    static reportMake2(caseId, templateId, taskId, finalize) {
        var request = {
            poHandleType: 'REPORT_MAKE',
            caseId: caseId,
            taskId: taskId,
            template: {
                id: templateId
            },
            finalize: finalize
        }
        PageOfficeApi._genPageLink(request);
    }

    /**
     * 动态渲染（出案）
     *
     * @param url
     * @param data
     * @param callback
     */
    static renderReport(caseId, taskId) {
        var request = {
            poHandleType: 'REPORT_DYNAMIC_RENDER',
            caseId: caseId,
            taskId: taskId
        }
        PageOfficeApi._genPageLink(request);
    }

    /**
     * 动态渲染（出案）
     *
     * @param url
     * @param data
     * @param callback
     */
    static renderProof(caseId, taskId) {
        var request = {
            poHandleType: 'REPORT_PROOF',
            caseId: caseId,
            taskId: taskId
        }
        PageOfficeApi._genPageLink(request);
    }

    static _genPageLink(request) {
        post(api.genPageOfficeLink, request).then((res) => {
            if (res.status == 200) {
                let pageLink = res.data.pageLink;
                window.location.href = pageLink;
            }
        }).catch((err) => {
            console.log(err)
        })
    }

}