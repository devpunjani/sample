"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { trpc } from "@/utils/trpc";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";

interface ChatResponse {
  text: string;
  image?: string | null;
  error?: string;
}

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [model, setModel] = useState<"gemini" | "openai">("gemini");
  const [generateImage, setGenerateImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: (data: ChatResponse) => {
      setMessage("");
      setError(null);
      toast.success("Message sent successfully!");
      console.log("Success:", data);
    },
    onError: (error: TRPCClientError<any>) => {
      console.error("Error:", error);
      setError(error.message);
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    setError(null);

    try {
      await sendMessage.mutateAsync({
        message,
        model,
        generateImage,
      });
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to send message");
    }
  };

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <h2>Please log in to use the chat</h2>
        <a href="/api/auth/login" className="btn btn-primary">
          Login
        </a>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    disabled={sendMessage.isLoading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="generate-image"
                    label="Generate Image"
                    checked={generateImage}
                    onChange={(e) => setGenerateImage(e.target.checked)}
                    disabled={sendMessage.isLoading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Select
                    value={model}
                    onChange={(e) =>
                      setModel(e.target.value as "gemini" | "openai")
                    }
                    disabled={sendMessage.isLoading}
                  >
                    <option value="gemini">Gemini</option>
                    <option value="openai">OpenAI</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={sendMessage.isLoading || !message.trim()}
                >
                  {sendMessage.isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {sendMessage.data && (
            <Card>
              <Card.Body>
                <Card.Text>{sendMessage.data.text}</Card.Text>
                {sendMessage.data.image && (
                  <img
                    src={sendMessage.data.image}
                    alt="Generated"
                    className="img-fluid mt-3"
                  />
                )}
                {sendMessage.data.error && (
                  <Alert variant="warning" className="mt-3">
                    {sendMessage.data.error}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}
