package org.leandi.modeler.dto.generator;

import org.apache.commons.lang3.StringUtils;

import java.io.IOException;

import static org.leandi.modeler.dto.generator.common.CommonMethods.*;

public class DtoAnchorGenerator {
    private static final String ANCHOR_TABLE_NAME = "@ANCHOR_TABLE_NAME@";
    private static final String anchorMne = "@anchor_mne@";
    private static final String ANCHOR_MNE = "@ANCHOR_MNE@";
    private static final String ANCHOR_DESC = "@ANCHOR_DESC@";

    private static final String COMPOUND_OBJECT_NAME = "@COMPOUND_OBJECT_NAME@";
    private static final String CONNEXIONS = "@CONNEXIONS@";
    private static final String QUERY_TREE = "@QUERY_TREE@";
    private static final String ID = "@ID@";
    private static final String ATTRIBUTE = "@ATTRIBUTE@";
    private static final String TIES = "@TIES@";

    private static final String ATTRIBUTE_TABLE_NAME = "@ATTRIBUTE_TABLE_NAME@";
    private static final String CAMEL_ATTRIBUTE_TABLE_NAME = "@CAMEL_ATTRIBUTE_TABLE_NAME@";
    private static final String ATTRIBUTE_DESC = "@ATTRIBUTE_DESC@";
    private static final String ATTRIBUTE_MNE = "@ATTRIBUTE_MNE@";

    private static final String DATA_RANGE = "@DATA_RANGE@";



    public static String getAnchorTemplate(String anchorMne, String anchorDesc, String dataRange){
        String anchorTemplate = null;
        try {
            anchorTemplate = getTemplateAsString("generator/dto.attribute.template");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        if (anchorTemplate == null){
            return "";
        }

        return anchorTemplate
//                .replace(ATTRIBUTE_TABLE_NAME, getAnchorTableName(anchorMne, attributeMne, anchorDesc, attributeDesc))
//                .replace(CAMEL_ATTRIBUTE_TABLE_NAME, getCamelAnchorTableName(anchorMne, attributeMne, anchorDesc, attributeDesc))
//                .replace(ANCHOR_MNE, anchorMne.toUpperCase())
                .replace(ANCHOR_DESC, anchorDesc.toUpperCase())
                .replace(ATTRIBUTE_MNE, anchorMne.toUpperCase())
                .replace(ATTRIBUTE_DESC, anchorMne.toUpperCase())
                .replace(DATA_RANGE, getDefaultNullValueAsString(dataRange));
    }
    private static String getDefaultNullValueAsString(String dataRange){
        String dRange;
        switch (dataRange){
            case "BIGINT":
                dRange = "NULL_LONG";
            case "STRING":
                dRange = "NULL_STRING";
            case "DATE":
                dRange = "NULL_LOCAL_DATE";
            case "TIME":
                dRange = "NULL_LOCAL_DATE_TIME";
            default:
                dRange = "";
        }
        return dRange;
    }
    private static String getAnchorTableName(String ...anchorData){
        String str = getCamelAnchorTableName(anchorData);
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
    private static String getCamelAnchorTableName(String ...anchorData){
        return StringUtils.join(anchorData);
    }

}
