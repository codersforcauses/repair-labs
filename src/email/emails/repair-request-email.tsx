import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components";

interface RepairRequestEmailProps {
  customerName?: string;
  requestId?: string;
  date?: string;
  itemName?: string;
  issueDescription?: string;
  estimatedDate?: string;
  emailSignature?: string;
  facebookLink?: string;
  logoUrl?: string; // Assuming you might want to display your company logo at the top
}
export const RepairRequestEmail = ({
  customerName,
  requestId,
  date,
  itemName,
  issueDescription,
  estimatedDate,
  emailSignature
}: RepairRequestEmailProps) => {
  const previewText = `Confirmation of Your Repair Request - #${requestId}`;
  const facebookLink = "https://www.facebook.com/RepairLabPerth/";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px] flex justify-center text-center">
              <Img
                src="https://repair-lab-images.s3.ap-southeast-2.amazonaws.com/repair.png"
                width="100"
                height="100"
                alt="Logo"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Confirmation of Your Repair Request - #{requestId}
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {customerName},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Thank you for reaching out to us regarding your repair needs. We
              have successfully received your request, and our team will review
              it promptly.
            </Text>
            <Section>
              <Text className="text-[12px] font-bold leading-[24px] text-black">
                Repair Request Details:
              </Text>
              <Text className="text-[12px] leading-[24px] text-black">
                Request ID: {requestId}
              </Text>
              <Text className="text-[12px] leading-[24px] text-black">
                Date of Request: {date}
              </Text>
              <Text className="text-[12px] leading-[24px] text-black">
                Product/Item: {itemName}
              </Text>
              <Text className="text-[12px] leading-[24px] text-black">
                Issue Description: {issueDescription}
              </Text>
              <Text className="text-[12px] leading-[24px] text-black">
                Estimated Repair Date: {estimatedDate} (please note that this
                date is subject to change based on the nature and complexity of
                the issue)
              </Text>
            </Section>
            <Text className="mt-[32px] text-[13px] leading-[24px] text-black">
              For updates on your repair request, or if you have any further
              questions, please feel free to get in touch with us via our
              <Link href={facebookLink} className="text-blue-600 no-underline">
                {" "}
                official Facebook page
              </Link>
              . Our team is active there and will assist you with any concerns.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              We value your trust and are committed to providing you with the
              best possible service. Thank you for choosing us for your repair
              needs.
            </Text>
            <Text className="mt-[32px] text-[14px] leading-[24px] text-black">
              Warm regards,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Repair Labs
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              {emailSignature}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RepairRequestEmail;
