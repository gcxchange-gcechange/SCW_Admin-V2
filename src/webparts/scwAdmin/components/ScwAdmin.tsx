/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import styles from "./ScwAdmin.module.scss";
import { IScwAdminProps } from "./IScwAdminProps";
import { getSP } from "../../../pnpjsConfig";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { useEffect, useState } from "react";
import {
  DatePicker,
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  DetailsRow,
  FontIcon,
  IButtonStyles,
  IColumn,
  IDetailsColumnRenderTooltipProps,
  IDetailsColumnStyles,
  IDetailsHeaderProps,
  IDetailsListProps,
  IDetailsRowStyles,
  IRenderFunction,
  IScrollablePaneStyles,
  IStackStyles,
  IStackTokens,
  Icon,
  Label,
  PrimaryButton,
  ScrollablePane,
  ScrollbarVisibility,
  SearchBox,
  Spinner,
  SpinnerSize,
  Stack,
  Sticky,
  StickyPositionType,
  TextField,
  TooltipHost,
  mergeStyleSets,
} from "office-ui-fabric-react";
import { PagedItemCollection } from "@pnp/sp/items";
import ItemFormDetails from "./ItemFormDetails";
import { getTheme } from "@fluentui/react/lib/Styling";
import {
  HttpClientResponse,
  IHttpClientOptions,
  AadHttpClient,
} from "@microsoft/sp-http";
import Complete from "./Complete";
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
  IDropdownOption,
} from "@fluentui/react/lib/Dropdown";
import { mergeStyles } from "@fluentui/react/lib/Styling";


export interface ISCWList {
  id: number;
  spaceName: string;
  spaceNameFr: string;
  spaceDescription: string;
  spaceDescriptionFR: string;
  businessJustification: string;
  requesterEmail: string;
  requesterName: string;
  members: string;
  owner1: string;
  created: string;
  template: string;
  status: string;
  siteUrl: string;
  comment: string;
  approvedDate: string;
}

const ScwAdmin = (props: IScwAdminProps) => {
  const _sp: SPFI = getSP(props.context);
  const BATCH_SIZE = 1000;

  const [requestList, setRequestList] = useState<ISCWList[]>([]);
  const [selectedRowData, setSelectedRowData] = useState<any>();
  const [step, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isError, setIsError] = useState<number>(0);
  const [filterStatusInput, setfilterStatusInput] = useState<IDropdownOption>();
  const [filterReqNameInput, setfilterReqNameInput] = useState("");
  const [filterCDateInput, setfilterCDateInput] = React.useState<
    Date | undefined
  >();
  const [filterADateInput, setfilterADateInput] = React.useState<
    Date | undefined
  >();
  const [searchInput, setSearchInput] = useState("");

  const [page, setPage] = useState<number>(1);

  const columns: IColumn[] = [
    { key: "Col0", name: "ID", fieldName: "id", minWidth: 40, maxWidth: 80 },
    {
      key: "Col1",
      name: "Community Name",
      fieldName: "spaceName",
      minWidth: 210,
      maxWidth: 400,
      flexGrow: 1,
      isResizable: true,
    },
    {
      key: "Col2",
      name: "Template",
      fieldName: "template",
      minWidth: 100,
      maxWidth: 120,
    },
    {
      key: "Col3",
      name: "Status",
      fieldName: "status",
      minWidth: 100,
      maxWidth: 120,
      onRender: (item) => {
        switch (item.status) {
          case "Submitted":
            return (
              <>
                <span className={styles.iconStyle}>
                  <Icon iconName="SkypeCircleClock" />
                </span>
                {item.status}
              </>
            );

          case "Approved":
            return (
              <>
                <span className={styles.iconStyle}>
                  <Icon
                    className={styles.approved}
                    iconName="SkypeCircleCheck"
                  />
                </span>
                {item.status}
              </>
            );

          case "Rejected":
            return (
              <>
                <span className={styles.iconStyle}>
                  <Icon
                    className={styles.rejected}
                    iconName="StatusErrorFull"
                  />
                </span>
                {item.status}
              </>
            );

          case "Failed":
            return (
              <>
                <span className={styles.iconStyle}>
                  <Icon className={styles.failed} iconName="IncidentTriangle" />
                </span>
                <span style={{ color: "red" }}>{item.status}</span>
              </>
            );
          case "Complete":
            return (
              <>
                <span className={styles.iconStyle}>
                  <Icon
                    className={styles.completed}
                    iconName="VerifiedBrandSolid"
                  />
                </span>
                <span style={{ color: "#106ebe" }}>{item.status}</span>
              </>
            );
          case "Site Exists":
            return (
              <>
                <span className={styles.iconStyle}>
                  <Icon className={styles.failed} iconName="IncidentTriangle" />
                </span>
                <span style={{ color: "red" }}>{item.status}</span>
              </>
            );
          case "No Owner":
            return (
              <>
                <span className={styles.iconStyle}>
                  <Icon className={styles.failed} iconName="IncidentTriangle" />
                </span>
                <span style={{ color: "red" }}>{item.status}</span>
              </>
            );
          default:
        }
      },
    },
    {
      key: "Col4",
      name: "Created Date",
      fieldName: "created",
      minWidth: 70,
      maxWidth: 90,
    },
    {
      key: "Col5",
      name: "Approved Date",
      fieldName: "approvedDate",
      minWidth: 70,
      maxWidth: 90,
    },
  ];

  const goToNextStep = (step: any): void => {
    const nextPage = step + 1;
    setCurrentStep(nextPage);
  };

  const goToPreviousStep = (step: any): void => {
    const previousPage = step - 1;

    setCurrentStep(previousPage);
  };

  const getList = async () => {
    let pagedItems: any[] = [];
    let items: PagedItemCollection<any[]> = undefined;

    do {
      if (!items)
        items = await _sp.web.lists
          .getById(props.list)
          .items.select(
            "ID",
            "Title",
            "SpaceNameFR",
            "SpaceDescription",
            "SpaceDescriptionFR",
            "RequesterName",
            "RequesterEmail",
            "Members",
            "Owner1",
            "BusinessJustification",
            "Created",
            "Status",
            "TemplateTitle",
            "SiteUrl",
            "Comment",
            "ApprovedDate",
            "SecurityCategory"
          )
          .top(BATCH_SIZE)
          .orderBy("Created", false)
          .getPaged();
      else items = await items.getNext();
      if (items.results.length > 0) {
        pagedItems = pagedItems.concat(items.results);
      }
    } while (items.hasNext);

    setRequestList(
      pagedItems.map((item) => {
        console.log("pagedItems", pagedItems);
        if (item.Comment === null) {
          item.Comment = "";
        }

        return {
          id: item.ID,
          spaceName: item.Title,
          spaceNameFr: item.SpaceNameFR,
          spaceDescription: item.SpaceDescription,
          spaceDescriptionFR: item.SpaceDescriptionFR,
          requesterName: item.RequesterName,
          requesterEmail: item.RequesterEmail,
          members: item.Members,
          owner1: item.Owner1,
          businessJustification: item.BusinessJustification,
          created: new Date(item.Created).toLocaleDateString("en-CA"),
          approvedDate: item.ApprovedDate
            ? new Date(item.ApprovedDate).toLocaleDateString("en-CA")
            : "Not yet created",
          status: item.Status,
          template: item.SecurityCategory,
          siteUrl: item.SiteUrl,
          comment: item.Comment,
        };
      })
    );
  };

  useEffect(() => {
    getList();
  }, [step]);

  const theme = getTheme();

  const headerStyle: Partial<IDetailsColumnStyles> = {
    cellTitle: {
      position: "sticky",
      fontSize: 14,
      fontWeight: 600,
    },
  };

  const _onRenderRow: IDetailsListProps["onRenderRow"] = (props) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      if (props.itemIndex % 2 === 0) {
        // Every other row renders with a different background color
        customStyles.root = { backgroundColor: `${theme}` };
      }

      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    props,
    defaultRender
  ) => {
    if (!props) {
      return null;
    }
    const onRenderColumnHeaderTooltip: IRenderFunction<
      IDetailsColumnRenderTooltipProps
    > = (tooltipHostProps) => <TooltipHost {...tooltipHostProps} />;
    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced>
        {defaultRender?.({
          ...props,
          onRenderColumnHeaderTooltip,
        })}
      </Sticky>
    );
  };

  const onItemInvoked = (item: any) => {
    goToNextStep(step);
    setSelectedRowData(item);
  };

  const scrollStyles = mergeStyleSets({
    wrapper: {
      height: "40vh",
      position: "relative",
      backgroundColor: "white",
      margin: "10px",
    },
    root: {
      height: "40vh",
      position: "relative",
    },
  });

  const scrollablePaneStyles: Partial<IScrollablePaneStyles> = {
    root: scrollStyles.root,
  };

  const buttonStyle: Partial<IButtonStyles> = {
    root: {
      backgroundColor: "#c0c0cc",
      color: "#004DB8",
      borderColor: "#c0c0cc",
    },
    rootHovered: { backgroundColor: "#c0c0cc" },
    rootFocused: { backgrounColor: "#c0c0cc!important" },
  };

  const decisionChoiceCallback = (option: string): void => {
    if (option === "A") {
      setSelectedRowData({
        ...selectedRowData,
        decisionStatus: "Approved",
      });
    } else if (option === "B") {
      setSelectedRowData({
        ...selectedRowData,
        decisionStatus: "Rejected",
      });
    } else {
      setSelectedRowData({
        ...selectedRowData,
        decisionStatus: null,
      });
    }
  };

  const confirmationComments = (value: string): void => {
    if (value) {
      setSelectedRowData({
        ...selectedRowData,
        comment: value,
      });
    }
  };

  const onConfirm = (): void => {
    const isApproved = selectedRowData.decisionStatus === "Approved";
    const hasValidComment =
      selectedRowData.comment.length >= 5 || selectedRowData.comment === "";
    const isRejected = selectedRowData.decisionStatus === "Rejected";
    const hasNonEmptyComment = selectedRowData.comment !== "";

    if (
      (isApproved && (hasValidComment || selectedRowData.comment === "")) ||
      (isRejected && hasNonEmptyComment)
    ) {
      const functionUrl: string ='';

      const requestHeaders: Headers = new Headers();
      requestHeaders.append("Content-type", "application/json");
      requestHeaders.append("Cache-Control", "no-cache");
      const postOptions: IHttpClientOptions = {
        headers: requestHeaders,
        body: `
                  {
                    "Id": "${selectedRowData.id}",
                    "Status": "${selectedRowData.decisionStatus}", 
                    "Comment": "${selectedRowData.comment}"    
              }`,
      };

      setIsLoading(true);

      props.context.aadHttpClientFactory
        .getClient("")
        .then((client: AadHttpClient) => {
          client
            .post(functionUrl, AadHttpClient.configurations.v1, postOptions)
            .then((response: HttpClientResponse) => {
              console.log(`RESPONSE:`, response);
              console.log(`Status code:`, response.status);
              console.log("response is ", response.ok);
              if (response.status === 200) {
                setIsLoading(false);
                setIsError(response.status);
                setShowModal((prev) => !prev);
              } else {
                setIsLoading(false);
                setIsError(response.status);
                setShowModal(true);
              }
            });
        })

        .catch((response: any) => {
          const errMsg: string = `HELLO WARNING - error when calling URL ${functionUrl}. ERROR = ${response.message}`;
          console.log("err is: ", errMsg);
        });
    } else {
      setShowModal((prev) => !prev);
    }
  };

  const closeModal = (): void => {
    setShowModal(false);

    if (selectedRowData.decisionStatus) {
      setCurrentStep(step - 1);
    }
  };

  const handleSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    console.log("What DId I type", event.target.value);
    setSearchInput(event.target.value.toLowerCase());
    setPage(1);
  };

  const handleStatusFilter = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    setfilterStatusInput(option);
    setPage(1);
  };

  const handleReqNameFilter = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setfilterReqNameInput(event.target.value.toLowerCase());
    setPage(1);
  };
  
  const clearADateFilter = (
    event: React.MouseEvent<HTMLInputElement>
  ): void => {
    setfilterADateInput(undefined);
    setPage(1);
  };
  const clearCDateFilter = (
    event: React.MouseEvent<HTMLInputElement>
  ): void => {
    setfilterCDateInput(undefined);
    setPage(1);
  };
  const getPage = (page: number): void => {
    console.log(page);
    setPage(page);
  };

  const sectionStackTokens: IStackTokens = { childrenGap: 10 };

  const stackStyles: IStackStyles = {
    root: {
      marginTop: "18px",
    },
  };

  const startIndex: number = (page - 1) * 100;
  const endIndex: number = Math.min(startIndex + 100, requestList.length);
  const searchItemsDisplay = searchInput
    ? requestList.filter((item) =>
        Object.entries(item).some(
          ([key, val]) =>
            [
              "id",
              "spaceName",
              "spaceNameFr",
              "owner1",
              "requesterEmail",
              "requesterName",
            ].includes(key) &&
            val !== null &&
            val.toString().toLowerCase().includes(searchInput.toLowerCase())
        )
      )
    : requestList;

  const filterStatusItems = filterStatusInput
    ? searchItemsDisplay.filter((item) =>
        Object.entries(item).some(
          ([key, val]) =>
            ["status"].includes(key) &&
            val !== null &&
            val.toString().toLowerCase().includes(filterStatusInput.key)
        )
      )
    : searchItemsDisplay;
  const filterReqNameItems = filterReqNameInput
    ? filterStatusItems.filter((item) =>
        Object.entries(item).some(
          ([key, val]) =>
            ["requesterName"].includes(key) &&
            val !== null &&
            val
              .toString()
              .toLowerCase()
              .includes(filterReqNameInput.toLowerCase())
        )
      )
    : filterStatusItems;
  const filterCDateItems = filterCDateInput
    ? filterReqNameItems.filter((item) =>
        Object.entries(item).some(
          ([key, val]) =>
            ["created"].includes(key) &&
            val !== null &&
            val
              .toString()
              .toLowerCase()
              .includes(
                filterCDateInput.toLocaleDateString("en-CA").toLowerCase()
              )
        )
      )
    : filterReqNameItems;
  const filterADateItems = filterADateInput
    ? filterCDateItems.filter((item) =>
        Object.entries(item).some(
          ([key, val]) =>
            ["approvedDate"].includes(key) &&
            val !== null &&
            val
              .toString()
              .toLowerCase()
              .includes(
                filterADateInput.toLocaleDateString("en-CA").toLowerCase()
              )
        )
      )
    : filterCDateItems;

  const filterItemsDisplay = filterADateItems;
  console.log(searchItemsDisplay);
  console.log(filterStatusInput);
  const displayItemsPerPage = filterItemsDisplay.slice(startIndex, endIndex);

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 200 },
  };

  const options: IDropdownOption[] = [
    { key: "", text: "All Status" },
    { key: "submitted", text: "Submitted" },
    { key: "approved", text: "Approved" },
    { key: "complete", text: "Complete" },
    { key: "site exists", text: "Site Exists" },
    { key: "no owner", text: "No Owner" },
    { key: "rejected", text: "Rejected" },
    { key: "failed", text: "Failed" },
  ];

  const stackTokens: IStackTokens = { childrenGap: 20 };
  const iconClass = mergeStyles({
    fontSize: 20,
    height: 50,
    width: 50,
    margin: "35px -30px",
    cursor:"pointer"
  });

  return (
    <>
      <div className={styles.container}>
        {step === 1 && (
          <>
            <h2>SCW communities requests</h2>
            <h3>Total Items {filterItemsDisplay.length}</h3>
            <div className={styles.search}>
              <span>
                <Icon className={styles.searchIcon} iconName="Search" />
              </span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search"
                onChange={handleSearchInput}
                value={searchInput}
              />
            </div>
            <div>
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(filterItemsDisplay.length / 100)}
                onChange={(page) => getPage(page)}
                limiter={3} // Optional - default value 3
                hideFirstPageJump // Optional
                hideLastPageJump // Optional
              />
            </div>

            <Stack
              horizontal={true}
              tokens={stackTokens}
              horizontalAlign="center">
              <Dropdown
                placeholder="Select a status"
                label="Filter By Status"
                options={options}
                styles={dropdownStyles}
                onChange={handleStatusFilter}
              />
              <TextField
                label="Filter By Requester Name"
                value={filterReqNameInput}
                onChange={handleReqNameFilter}
              />

              <DatePicker
                label="Filter By Created Date"
                title="Select a date..."
                value={filterCDateInput}
                onSelectDate={
                  setfilterCDateInput as (date: Date | null | undefined) => void
                }
                placeholder="Select a date..."
              />
              <FontIcon
                aria-label="ClearFilter"
                title="Clear Filter By Created Date"
                iconName="ClearFilter"
                onClick={clearCDateFilter}
                className={iconClass}
              />
              <DatePicker
                label="Filter By Approved Date"
                title="Select a date..."
                value={filterADateInput}
                onSelectDate={
                  setfilterADateInput as (date: Date | null | undefined) => void
                }
                placeholder="Select a date..."
              />
              <FontIcon
                aria-label="ClearFilter"
                title="Clear Filter By Approved Date"
                iconName="ClearFilter"
                onClick={clearADateFilter}
                className={iconClass}
              />
            </Stack>
            <ScrollablePane
              scrollbarVisibility={ScrollbarVisibility.auto}
              styles={scrollablePaneStyles}>
              <DetailsList
                styles={headerStyle}
                items={displayItemsPerPage}
                columns={columns}
                layoutMode={DetailsListLayoutMode.justified}
                onRenderRow={_onRenderRow}
                isHeaderVisible={true}
                onRenderDetailsHeader={onRenderDetailsHeader}
                onItemInvoked={onItemInvoked}
              />
            </ScrollablePane>
          </>
        )}

        {isLoading === true ? (
          <Spinner size={SpinnerSize.large} />
        ) : (
          step === 2 && (
            <>
              <ItemFormDetails
                selectedRowData={selectedRowData}
                confirmationComments={confirmationComments}
                context={props.context}
                decisionChoiceCallback={decisionChoiceCallback}
                requestList={requestList}
              />

              <Stack
                horizontal
                horizontalAlign="center"
                tokens={sectionStackTokens}
                styles={stackStyles}>
                {selectedRowData.status === "Submitted" ? (
                  <>
                    <DefaultButton
                      styles={buttonStyle}
                      text="Previous"
                      onClick={() => goToPreviousStep(step)}
                    />
                    <PrimaryButton
                      text={"Submit decision"}
                      onClick={onConfirm}
                    />
                  </>
                ) : (
                  <PrimaryButton
                    text="Back to Communities List Page"
                    onClick={() => goToPreviousStep(step)}
                  />
                )}
              </Stack>
            </>
          )
        )}
        {showModal && (
          <Complete
            data={selectedRowData.id}
            spaceName={selectedRowData.spaceName}
            spaceNameFr={selectedRowData.spaceNameFr}
            status={selectedRowData.decisionStatus}
            comment={selectedRowData.comment}
            showModal={showModal}
            onClose={closeModal}
            isError={isError}
          />
        )}
      </div>
    </>
  );
};

export default ScwAdmin;
