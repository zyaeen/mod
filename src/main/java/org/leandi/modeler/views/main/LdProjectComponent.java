package org.leandi.modeler.views.main;


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
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.VaadinServlet;
import jakarta.xml.bind.JAXBException;
import org.apache.commons.lang3.StringUtils;
import org.leandi.schema.SchemaUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static org.leandi.modeler.dto.generator.common.SessionAttribute.*;

@JsModule("./LdProjectComponent.ts")
@NpmPackage(value = "vis-network", version = "9.1.2")
@Tag("ld-project")
@Uses(Icon.class)
@Uses(MenuBar.class)
@Uses(Upload.class)
@PageTitle("Project")
@Route(value = "")
public class LdProjectComponent extends VerticalLayout {

    SchemaUtils projectSchemaUtil;
    MultiFileMemoryBuffer multiFileMemoryBuffer = new MultiFileMemoryBuffer();
    Upload multiFileUpload = new Upload(multiFileMemoryBuffer);

    @Autowired
    public LdProjectComponent() {

        SchemaUtils projectSchemaUtilFromSession = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(PROJECT_SCHEMA);
        this.projectSchemaUtil = Objects.requireNonNullElseGet(projectSchemaUtilFromSession, SchemaUtils.builder()::build);

        multiFileUpload.addSucceededListener(event -> {
            String fileName = event.getFileName();
            InputStream loadedIs = multiFileMemoryBuffer.getInputStream(fileName);
            this.projectSchemaUtil = SchemaUtils.builder().projectXml(loadedIs).build();
            VaadinServlet.getCurrent().getServletContext().setAttribute(PROJECT_SCHEMA, this.projectSchemaUtil);
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
        SchemaUtils projectSchemaFromSession = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(PROJECT_SCHEMA);
        this.projectSchemaUtil = Objects.requireNonNullElseGet(projectSchemaFromSession, SchemaUtils.builder()::build);
        try {
            sendTree();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @ClientCallable
    private void marshall() {
        VaadinServlet.getCurrent().getServletContext().setAttribute(PROJECT_SCHEMA, this.projectSchemaUtil);
        try {
            String xmlContent = this.projectSchemaUtil.marshallProject();
            getElement().executeJs("this.saveToFile($0)", xmlContent);
        } catch (JAXBException e) {
            throw new RuntimeException(e);
        }
    }

    @ClientCallable
    private void updateProject() {
        SchemaUtils projectSchemaFromSession = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(PROJECT_SCHEMA);
        this.projectSchemaUtil = Objects.requireNonNullElseGet(projectSchemaFromSession, SchemaUtils.builder()::build);
    }

    @ClientCallable
    private void openUpload() {
        Page page = UI.getCurrent().getPage();
        page.executeJs("document.getElementById('vaadin-upload').shadowRoot.getElementById('addFiles').click()");
    }

    @ClientCallable
    private void openDomain(String domainShortName) {
        UI.getCurrent().navigate("domain/" + domainShortName + "/");
    }

    @ClientCallable
    private void addDomain(String domainData) {
        this.projectSchemaUtil.addDomain(domainData);
        VaadinServlet.getCurrent().getServletContext().setAttribute(PROJECT_SCHEMA, this.projectSchemaUtil);
    }

    @ClientCallable
    private void updateDomain(String domainData) {
        Map<String, String> shortNames = this.projectSchemaUtil.updateDomain(domainData);
        VaadinServlet.getCurrent().getServletContext().setAttribute(PROJECT_SCHEMA, this.projectSchemaUtil);
        if (!shortNames.isEmpty()) {
            SchemaUtils deploy = getHostsFromSession();
            if (StringUtils.equals(deploy.getDeploy().getProject(), this.projectSchemaUtil.getProject().getUid())){
                deploy.renewDomains(shortNames);
                setHostsFromSession(deploy);
            }
        }
    }

    @ClientCallable
    private void deleteConnexion(String connexionUid) {
        projectSchemaUtil.deleteConnexion(connexionUid);
    }

    @ClientCallable
    private void deleteDomain(String domainShortName) {
        projectSchemaUtil.deleteDomain(domainShortName);
        SchemaUtils deploy = getHostsFromSession();
        deploy.deleteDomainFromDeploy(domainShortName);
        setHostsFromSession(deploy);
    }

    @ClientCallable
    private void redirectToHosts() {
        VaadinServlet.getCurrent().getServletContext().setAttribute(PROJECT_SCHEMA, this.projectSchemaUtil);
        UI.getCurrent().navigate("hosts");
    }

    @ClientCallable
    private void buildNewProject() {
        this.projectSchemaUtil = SchemaUtils.builder().build();
        VaadinServlet.getCurrent().getServletContext().setAttribute(PROJECT_SCHEMA, this.projectSchemaUtil);
        try {
            sendTree();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendTree() throws IOException {
        getElement().executeJs("this.getTree($0, $1, $2)",
                projectSchemaUtil.domainListAsJson(),
                projectSchemaUtil.connexionsAsJson(),
                projectSchemaUtil.getProject().getUid()
        );
    }

    private SchemaUtils getHostsFromSession() {
        SchemaUtils deploy = (SchemaUtils) VaadinServlet.getCurrent()
                .getServletContext().getAttribute(DEPLOY_SCHEMA);
        return Objects.requireNonNullElseGet(deploy, SchemaUtils.builder()::build);
    }

    private void setHostsFromSession(SchemaUtils deploy) {
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, deploy);
    }
}
