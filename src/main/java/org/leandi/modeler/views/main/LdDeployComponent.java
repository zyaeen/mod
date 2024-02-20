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
import java.util.Objects;

import static org.leandi.modeler.dto.generator.common.SessionAttribute.DEPLOY_SCHEMA;
import static org.leandi.modeler.dto.generator.common.SessionAttribute.PROJECT_SCHEMA;
import static org.leandi.modeler.views.main.LdDeployComponent.ROUTE;

@JsModule("./LdDeployComponent.ts")
@NpmPackage(value = "vis-network", version = "9.1.2")
@Tag("ld-deploy")
@Uses(Icon.class)
@Uses(MenuBar.class)
@Uses(Upload.class)
@PageTitle("Deploy model")
@Route(value = ROUTE)
public class LdDeployComponent extends VerticalLayout {
    public static final String ROUTE = "hosts";
    public static final String DOMAIN_ROUTE = "domain";

    SchemaUtils deploySchemaUtil;

    MultiFileMemoryBuffer multiFileMemoryBuffer = new MultiFileMemoryBuffer();
    Upload multiFileUpload = new Upload(multiFileMemoryBuffer);


    @Autowired
    public LdDeployComponent() {

        SchemaUtils deploySchemaUtilFromSession = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(DEPLOY_SCHEMA);
        this.deploySchemaUtil = Objects.requireNonNullElseGet(deploySchemaUtilFromSession, SchemaUtils.builder()::build);

         SchemaUtils projectSchemaUtilFromSession = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(PROJECT_SCHEMA);
        if (projectSchemaUtilFromSession != null) {
            if (deploySchemaUtilFromSession == null) {
                this.deploySchemaUtil.getDeploy().setProject(projectSchemaUtilFromSession.getProject().getUid());
            } else if (StringUtils.isEmpty(deploySchemaUtilFromSession.getDeploy().getProject())) {
                this.deploySchemaUtil.getDeploy().setProject(projectSchemaUtilFromSession.getProject().getUid());
            }
        }

        multiFileUpload.addSucceededListener(event -> {
            String fileName = event.getFileName();
            InputStream loadedIs = multiFileMemoryBuffer.getInputStream(fileName);
            this.deploySchemaUtil = SchemaUtils.builder().deployXml(loadedIs).build();
            VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, this.deploySchemaUtil);
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
        SchemaUtils deploySchemaFromSession = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(DEPLOY_SCHEMA);
        this.deploySchemaUtil = Objects.requireNonNullElseGet(deploySchemaFromSession, SchemaUtils.builder()::build);
        SchemaUtils projectSchemaUtilFromSession = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(PROJECT_SCHEMA);
        if (projectSchemaUtilFromSession != null) {
            if (deploySchemaFromSession == null) {
                this.deploySchemaUtil.getDeploy().setProject(projectSchemaUtilFromSession.getProject().getUid());
            } else if (StringUtils.isEmpty(deploySchemaFromSession.getDeploy().getProject())) {
                this.deploySchemaUtil.getDeploy().setProject(projectSchemaUtilFromSession.getProject().getUid());
            }
        }
        try {
            sendTree();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @ClientCallable
    private void buildNewDeployModel() {
        this.deploySchemaUtil = SchemaUtils.builder().build();
        SchemaUtils projectSchemaUtilFromSession = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(PROJECT_SCHEMA);
        if (projectSchemaUtilFromSession != null) {
            this.deploySchemaUtil.getDeploy().setProject(projectSchemaUtilFromSession.getProject().getUid());
        }
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, this.deploySchemaUtil);
        try {
            sendTree();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @ClientCallable
    private void marshall() {
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, this.deploySchemaUtil);
        this.deploySchemaUtil = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(DEPLOY_SCHEMA);
        try {
            String xmlContent = this.deploySchemaUtil.marshallDeployModel();
            getElement().executeJs("this.saveToFile($0)", xmlContent);
        } catch (JAXBException e) {
            throw new RuntimeException(e);
        }
    }


    @ClientCallable
    private void openUpload() {
        Page page = UI.getCurrent().getPage();
        page.executeJs("document.getElementById('vaadin-upload').shadowRoot.getElementById('addFiles').click()");
    }

    @ClientCallable
    private void redirectToDomain(String redirectData) {
        String[] data = redirectData.split(",");
        SchemaUtils projectSchema = (SchemaUtils) VaadinServlet.getCurrent().getServletContext().getAttribute(PROJECT_SCHEMA);
        if (projectSchema == null) {
            getElement().executeJs("this.preventRedirect($0)", "Project is empty!");
        } else {
            if (StringUtils.equals(projectSchema.getProject().getUid(), this.deploySchemaUtil.getDeploy().getProject())) {
                org.leandi.schema.domain.Domain domain = projectSchema.getProject().getDomain().stream()
                        .filter(dom -> StringUtils.equals(dom.getShortName(), data[0]))
                        .findFirst().orElse(null);
                if (domain != null) {
                    if (data.length > 1) {
                        openDomain(data[0], data[1]);
                    } else {
                        openDomain(data[0], "");
                    }
                } else {
                    getElement().executeJs("this.preventRedirect($0)",
                            "There is no Domain with name " + data[0]);
                }
            } else {
                getElement().executeJs("this.preventRedirect($0)", "This is the Domain of another Project!");
            }
        }
    }

    private void openDomain(String domainShortName, String anchorMnemonic) {
        String url = "window.open('http://";
        UI.getCurrent().getPage().executeJs("return window.location.host").then(
            String.class,
            location -> {
                String navigation = url + location + "/" +
                    DOMAIN_ROUTE + "/" + domainShortName + "/" + anchorMnemonic + "', '_self')";
                UI.getCurrent().getPage().executeJs(navigation);
            }
        );
    }

    @ClientCallable
    private void redirectToProject() {
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, this.deploySchemaUtil);
        UI.getCurrent().navigate("/");
    }

    @ClientCallable
    private void addDbHost(String hostData) {
        this.deploySchemaUtil.addDbHost(hostData);
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, this.deploySchemaUtil);
    }

    @ClientCallable
    private void addFsHost(String hostData) {
        this.deploySchemaUtil.addFsHost(hostData);
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, this.deploySchemaUtil);
    }

    @ClientCallable
    private void updateDbHost(String hostData) {
        this.deploySchemaUtil.updateDbHost(hostData);
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, this.deploySchemaUtil);
    }

    @ClientCallable
    private void updateFsHost(String hostData) {
        this.deploySchemaUtil.updateFsHost(hostData);
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, this.deploySchemaUtil);
    }

    @ClientCallable
    private void deleteDbHost(String hostData) {
        this.deploySchemaUtil.deleteDbHost(hostData);
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, this.deploySchemaUtil);
    }

    @ClientCallable
    private void deleteFsHost(String hostData) {
        this.deploySchemaUtil.deleteFsHost(hostData);
        VaadinServlet.getCurrent().getServletContext().setAttribute(DEPLOY_SCHEMA, this.deploySchemaUtil);
    }

    public void sendTree() throws IOException {
        getElement().executeJs("this.getTree($0, $1, $2, $3)", deploySchemaUtil.dbHostsAsJson(),
                deploySchemaUtil.fsHostsAsJson(), deploySchemaUtil.getDomainsListFromDeploy(),
                deploySchemaUtil.getDeploy().getProject()
        );
    }
}
