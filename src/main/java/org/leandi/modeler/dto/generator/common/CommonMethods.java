package org.leandi.modeler.dto.generator.common;

import org.apache.commons.io.IOUtils;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class CommonMethods {
    public static String getTemplateAsString(String fileNamePath) throws IOException {
        InputStream inputStream = new FileInputStream(fileNamePath);
        return IOUtils.toString(inputStream, StandardCharsets.UTF_8);
    }
    public static String getStringStartingWithCapital(String str){
        return str.substring(0, 1).toUpperCase() + str.toLowerCase().substring(1);
    }
}
