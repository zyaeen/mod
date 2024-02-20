package org.leandi.modeler.views.main;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.vaadin.flow.component.ClientCallable;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;
import com.vaadin.flow.component.dependency.Uses;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.menubar.MenuBar;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.page.Page;
import com.vaadin.flow.component.upload.Upload;
import com.vaadin.flow.component.upload.receivers.MultiFileMemoryBuffer;
import com.vaadin.flow.router.*;
import com.vaadin.flow.server.VaadinServlet;
import jakarta.xml.bind.JAXBException;
import org.apache.commons.lang3.StringUtils;
import org.leandi.schema.SchemaUtils;
import org.leandi.schema.domain.Domain;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.leandi.modeler.dto.generator.common.SessionAttribute.*;
import static org.leandi.modeler.views.main.LdDomainComponent.ROUTE;

@JsModule("./LdDomainComponent.ts")
@NpmPackage(value = "vis-network", version = "9.1.2")
@Tag("ld-domain")
@Uses(Icon.class)
@Uses(MenuBar.class)
@Uses(Upload.class)
@PageTitle("Domain")
@Route(value = ROUTE + "/:domainShortName/:anchorMnemonic?")
public class LdDomainComponent extends VerticalLayout implements BeforeEnterObserver {
    public static final String ROUTE = "domain";
    public static final String DOMAIN_SHORT_NAME = "domainShortName";
    public static final String ANCHOR_MNEMONIC = "anchorMnemonic";


    private SchemaUtils domainSchemaUtil;
    MultiFileMemoryBuffer multiFileMemoryBuffer = new MultiFileMemoryBuffer();
    Upload multiFileUpload = new Upload(multiFileMemoryBuffer);

    private String focusAnchor;

    private String domainsMap = "{}";

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        String domainShortName = event.getRouteParameters().get(DOMAIN_SHORT_NAME).orElseGet(() -> null);
        this.focusAnchor = event.getRouteParameters().get(ANCHOR_MNEMONIC).orElseGet(() -> null);
        SchemaUtils projectFromSession = getProjectFromSession();
        if (domainShortName != null && projectFromSession.getProject() != null) {
            domainSchemaUtil = SchemaUtils.builder().domain(
                    projectFromSession.getProject().getDomain().stream().filter(
                            dom -> dom.getShortName().equals(domainShortName)
                    ).findFirst().orElse(null)
            ).build();
        } else {
            domainSchemaUtil = SchemaUtils.builder().build();
        }
        try {
            this.domainsMap = mapObjectToString(domainsAndAnchorsAsStringOfMap());
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Autowired
    public LdDomainComponent() {

        multiFileUpload.addSucceededListener(event -> {
            String fileName = event.getFileName();
            InputStream loadedIs = multiFileMemoryBuffer.getInputStream(fileName);
            SchemaUtils newDomain = SchemaUtils.builder().domainXml(loadedIs).build();
            this.domainSchemaUtil.fillDomainByAnotherDomain(newDomain);
            try {
                this.sendTree();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        multiFileUpload.setId("vaadin-upload");
        multiFileUpload.setAcceptedFileTypes(".xml");
        add(multiFileUpload);
    }

    @ClientCallable
    private void fillComponentRequest() {
        try {
            sendTree();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @ClientCallable
    private void marshall() {
        try {
            String xmlContent = this.domainSchemaUtil.marshall();
            getElement().executeJs("this.saveToFile($0)", xmlContent);
        } catch (JAXBException e) {
            throw new RuntimeException(e);
        }
    }

    @ClientCallable
    private void updateDomainInProject() {
        SchemaUtils project = getProjectFromSession();
        project.updateDomain(this.domainSchemaUtil.getDomain());
        setProjectFromSession(project);
    }

    @ClientCallable
    private void updateKnot(String knotJson) {
        this.domainSchemaUtil.updateKnot(knotJson);
    }

    @ClientCallable
    private void addKnot(String knotJson) {
        this.domainSchemaUtil.addKnot(knotJson);
    }

    @ClientCallable
    private void deleteKnot(String knotUid) {
        this.domainSchemaUtil.deleteKnot(knotUid);
    }

    @ClientCallable
    private void updateAnchor(String anchorJson) {
        this.domainSchemaUtil.updateAnchor(anchorJson);
    }

    @ClientCallable
    private void addAnchor(String anchorJson) {
        this.domainSchemaUtil.addAnchor(anchorJson);
    }

    @ClientCallable
    private void deleteAnchor(String anchorUid) {
        this.domainSchemaUtil.deleteAnchor(anchorUid);
    }

    @ClientCallable
    private void updateTie(String tieJson) {
        this.domainSchemaUtil.updateTie(tieJson);
    }

    @ClientCallable
    private void addTie(String tieJson) {
        this.domainSchemaUtil.addTie(tieJson);
    }

    @ClientCallable
    private void deleteTie(String tieUid) {
        this.domainSchemaUtil.deleteTie(tieUid);
    }

    @ClientCallable
    private void updateTxAnchor(String txAnchorJson) {
        this.domainSchemaUtil.updateTxAnchor(txAnchorJson);
    }

    @ClientCallable
    private void addTxAnchor(String txAnchorJson) {
        this.domainSchemaUtil.addTxAnchor(txAnchorJson);
    }

    @ClientCallable
    private void deleteTxAnchor(String txAnchorUid) {
        this.domainSchemaUtil.deleteTxAnchor(txAnchorUid);
    }

    @ClientCallable
    private void updateCdAnchor(String cdAnchorJson) {
        this.domainSchemaUtil.updateCdAnchor(cdAnchorJson);
    }

    @ClientCallable
    private void addCdAnchor(String cdAnchorJson) {
        this.domainSchemaUtil.addCdAnchor(cdAnchorJson);
    }

    @ClientCallable
    private void deleteCdAnchor(String cdAnchorUid) {
        this.domainSchemaUtil.deleteCdAnchor(cdAnchorUid);
    }

    @ClientCallable
    private void openUpload() {
        Page page = UI.getCurrent().getPage();
        page.executeJs("document.getElementById('vaadin-upload').shadowRoot.getElementById('addFiles').click()");
    }

    @ClientCallable
    private void createDto(String anchorData) {
    }

    @ClientCallable
    private void updateConnexions(String connexions) {
        SchemaUtils project = getProjectFromSession();
        project.updateConnexions(connexions);
        setProjectFromSession(project);
    }

    @ClientCallable
    private void deleteConnexions(String connexions) {
        SchemaUtils project = getProjectFromSession();
        project.deleteConnexion(connexions);
        setProjectFromSession(project);
    }

    @ClientCallable
    private void addItem(String items) {
        SchemaUtils deploy = getHostsFromSession();
        deploy.addDeployItem(items);
        setHostsFromSession(deploy);
    }

    @ClientCallable
    private void deleteItem(String items) {
        SchemaUtils deploy = getHostsFromSession();
        deploy.deleteDeployItem(items);
        setHostsFromSession(deploy);
    }

    @ClientCallable
    private void redirectToDomain(String redirectData) {
        String[] data = redirectData.split(",");
        SchemaUtils project = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(PROJECT_SCHEMA);
        SchemaUtils domain = SchemaUtils.builder().domain(project.getProject().getDomain()
                .stream().filter(
                        doma -> doma.getShortName().equals(data[0])
                ).findFirst().orElse(null)).build();
        if(data.length > 1){
            openDomain(domain.getDomain().getShortName(), data[1]);
        } else {
            openDomain(domain.getDomain().getShortName(), "");
        }
    }

    @ClientCallable
    private void redirectToProject() {
//        SchemaUtils project = getProjectFromSession();
//        project.updateDomain(this.domainSchemaUtil.getDomain());
//        setProjectFromSession(project);
        UI.getCurrent().navigate("/");
    }

    @ClientCallable
    private void requestForProperties() {
        this.updateDomainInProject();
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        try {
            objectNode.put("groups", domainSchemaUtil.groupsAsJson());
            objectNode.put("properties", domainSchemaUtil.propertiesAsJson());
            getElement().executeJs("this.getProperties($0)", objectMapper.writeValueAsString(objectNode));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @ClientCallable
    private void requestForAnchorsProperties() {
        this.updateDomainInProject();
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        try {
            objectNode.put("groups", domainSchemaUtil.groupsAsJson());
            objectNode.put("properties", domainSchemaUtil.propertiesAsJson());
            getElement().executeJs("this.getAnchorsProperties($0)", objectMapper.writeValueAsString(objectNode));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @ClientCallable
    private void requestForGroups() {
        this.updateDomainInProject();
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        try {
            objectNode.put("groups", domainSchemaUtil.groupsAsJson());
            objectNode.put("properties", domainSchemaUtil.propertiesAsJson());
            getElement().executeJs("this.getGroups($0)", objectMapper.writeValueAsString(objectNode));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @ClientCallable
    private void updateGroup(String json) {
        domainSchemaUtil.updateGroup(json);
        requestForGroups();
    }

    @ClientCallable
    private void removeGroup(String id) {
        domainSchemaUtil.removeGroup(id);
        requestForGroups();
    }

    @ClientCallable
    private void removePropertiesFromGroup(String json) {
        domainSchemaUtil.removePropertiesFromGroup(json);
        requestForGroups();
    }

    @ClientCallable
    private void removeGroupsFromGroup(String json) {
        domainSchemaUtil.removeGroupsFromGroup(json);
        requestForGroups();
    }

    @ClientCallable
    private void addPropertiesToGroup(String json) {
        domainSchemaUtil.addPropertiesToGroup(json);
        requestForGroups();
    }

    @ClientCallable
    private void addPropertiesToGroupWithPropertyResponse(String json) {
        domainSchemaUtil.addPropertiesToGroup(json);
        requestForProperties();
    }

    @ClientCallable
    private void addGroupsToGroup(String json) {
        domainSchemaUtil.addGroupsToGroup(json);
        requestForGroups();
    }

    @ClientCallable
    private void updateProperty(String json) {
        domainSchemaUtil.updateProperty(json);
        requestForProperties();
    }

    @ClientCallable
    private void deleteProperty(String json) {
        domainSchemaUtil.deleteProperty(json);
        requestForProperties();
    }

    @ClientCallable
    private void updateAnchorsProperties(String json) {
        domainSchemaUtil.updateAnchor(json);
        requestForAnchorsProperties();
    }

    @ClientCallable
    private void updateArea(String json) {
        domainSchemaUtil.updateArea(json);
        requestForAreas();
    }

    @ClientCallable
    private void deleteArea(String uid) {
        domainSchemaUtil.deleteArea(uid);
        requestForAreas();
    }

    private void requestForAreas() {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        try {
            objectNode.put("areas", domainSchemaUtil.areasAsJson());
            getElement().executeJs("this.getAreas($0)", objectMapper.writeValueAsString(objectNode));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendTree() throws IOException {
        getElement().executeJs("this.getTree($0)", createJsonToSend());
    }

    private String mapObjectToString(Object object) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(object);
    }

    private SchemaUtils getProjectFromSession() {
        SchemaUtils project = (SchemaUtils) VaadinServlet.getCurrent()
                .getServletContext().getAttribute(PROJECT_SCHEMA);
        return Objects.requireNonNullElseGet(project, SchemaUtils.builder()::build);
    }

    private SchemaUtils getHostsFromSession() {
        SchemaUtils deploy = (SchemaUtils) VaadinServlet.getCurrent()
                .getServletContext().getAttribute(DEPLOY_SCHEMA);
        return Objects.requireNonNullElseGet(deploy, SchemaUtils.builder()::build);
    }


    private void setProjectFromSession(SchemaUtils project) {
        VaadinServlet.getCurrent().getServletContext().setAttribute(PROJECT_SCHEMA, project);
    }

    private void setHostsFromSession(SchemaUtils deploy) {
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, deploy);
    }

    private void openDomain(String domainShortName, String anchorMnemonic) {
        String url = "window.open('http://";
        UI.getCurrent().getPage().executeJs("return window.location.host").then(
            String.class,
            location -> {
                 String navigation = url + location + "/" + ROUTE + "/" +
                     domainShortName + "/" + anchorMnemonic + "', '_self')";
                UI.getCurrent().getPage().executeJs(navigation);
            }
        );
    }

    private Map<String, List<String>> domainsAndAnchorsAsStringOfMap() {
        SchemaUtils projectSchemaUtil = getProjectFromSession();
        Map<String, List<String>> map = new HashMap<>();
        for (Domain domain : projectSchemaUtil.getProject().getDomain()) {
            if (!domain.getShortName().equals(domainSchemaUtil.getDomain().getShortName())) {
                map.put(domain.getShortName(), projectSchemaUtil.mnemonicPlusDescriptorList(domain));
            }
        }
        return map;
    }

    private String createJsonToSend() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();

        SchemaUtils project = getProjectFromSession();
        SchemaUtils hosts = getHostsFromSession();
        String dbHosts = "[]";
        String fsHosts = "[]";
        if (StringUtils.equals(project.getProject().getUid(), hosts.getDeploy().getProject())) {
            dbHosts = hosts.dbHostsAsJson();
            fsHosts = hosts.fsHostsAsJson();
        }

        objectNode.put("anchors", domainSchemaUtil.anchorsAsJson());
        objectNode.put("knots", domainSchemaUtil.knotsAsJson());
        objectNode.put("ties", domainSchemaUtil.tiesAsJson());
        objectNode.put("txAnchors", domainSchemaUtil.txAnchorsAsJson());
        objectNode.put("cdAnchors", domainSchemaUtil.cdAnchorsAsJson());
        objectNode.put("domainsMap", domainsMap);
        objectNode.put("connexions", project.connexionsAsJson());
        objectNode.put("dbHosts", dbHosts);
        objectNode.put("fsHosts", fsHosts);
        objectNode.put("focusAnchor", focusAnchor);
        objectNode.put("domainShortName", domainSchemaUtil.getDomain().getShortName());
        objectNode.put("areas", domainSchemaUtil.areasAsJson());
        objectNode.put("groups", domainSchemaUtil.groupsAsJson());
        objectNode.put("properties", domainSchemaUtil.propertiesAsJson());
        return objectMapper.writeValueAsString(objectNode);
    }

}
