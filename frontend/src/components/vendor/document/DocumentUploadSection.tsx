import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type DocumentType = 'ID_CARD' | 'BUSINESS_LICENSE' | 'TAX_CERTIFICATE';

interface Document {
  id: string;
  type: DocumentType;
  fileName: string;
  uploadDate: Date;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  url?: string;
}

const documentTypes: { type: DocumentType; label: string; description: string }[] = [
  { 
    type: 'ID_CARD', 
    label: 'National ID Card', 
    description: 'Front and back of your national ID card' 
  },
  { 
    type: 'BUSINESS_LICENSE', 
    label: 'Business License', 
    description: 'Valid business registration document' 
  },
  { 
    type: 'TAX_CERTIFICATE', 
    label: 'Tax Certificate', 
    description: 'Current tax certificate or receipt' 
  }
];

const DocumentUploadSection = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState<DocumentType | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  // Simulate fetching documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // This would be a tRPC call in a real app
        // const docs = await trpc.vendor.fetchVendorDocuments.query();
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockDocuments: Document[] = [
          {
            id: '1',
            type: 'ID_CARD',
            fileName: 'id-card-front-back.pdf',
            uploadDate: new Date('2023-11-15'),
            status: 'VERIFIED',
            url: '#'
          },
          {
            id: '2',
            type: 'BUSINESS_LICENSE',
            fileName: 'business-license-2023.pdf',
            uploadDate: new Date('2023-11-16'),
            status: 'PENDING',
            url: '#'
          }
        ];
        
        setDocuments(mockDocuments);
      } catch (error) {
        toast({
          title: "Failed to load documents",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
      }
    };

    fetchDocuments();
  }, [toast]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, docType: DocumentType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a PDF, JPEG or PNG file');
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, JPEG or PNG file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File must be less than 5MB');
      toast({
        title: "File too large",
        description: "File must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(docType);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // This would be a tRPC call in a real app
      // await trpc.vendor.uploadVendorDocument.mutate({ 
      //   type: docType,
      //   file: file  // In a real app, you'd handle the file upload properly
      // });
      
      // Simulate successful upload and API response
      const newDoc: Document = {
        id: Math.random().toString(36).substring(7),
        type: docType,
        fileName: file.name,
        uploadDate: new Date(),
        status: 'PENDING',
      };
      
      setDocuments(prev => {
        // Replace if document of same type exists
        const exists = prev.findIndex(doc => doc.type === docType);
        if (exists >= 0) {
          const updated = [...prev];
          updated[exists] = newDoc;
          return updated;
        }
        // Otherwise add new document
        return [...prev, newDoc];
      });
      
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded and is pending review",
      });
    } catch (error) {
      setUploadError('Upload failed. Please try again.');
      toast({
        title: "Upload Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
      
      // Auto-retry logic (in a real app)
      // setTimeout(() => {
      //   handleFileChange(e, docType);
      // }, 3000);
    } finally {
      setIsUploading(null);
      setUploadProgress(0);
    }
  };

  const getDocumentStatus = (type: DocumentType) => {
    return documents.find(doc => doc.type === type);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-green-600 bg-green-50';
      case 'REJECTED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 mb-4 border-b">
        <h2 className="text-2xl font-bold text-cameroon-blue">Document Verification</h2>
        <p className="text-gray-500 mt-1">
          Please upload the following documents to verify your account.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentTypes.map((docType) => {
          const existingDoc = getDocumentStatus(docType.type);
          return (
            <Card key={docType.type} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{docType.label}</CardTitle>
                <CardDescription>{docType.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {isUploading === docType.type ? (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-center text-gray-500">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                ) : existingDoc ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1" title={existingDoc.fileName}>
                        {existingDoc.fileName}
                      </span>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(existingDoc.status)}`}
                      >
                        {existingDoc.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Uploaded on {existingDoc.uploadDate.toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">PDF, JPEG or PNG, max 5MB</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-between">
                <div className="text-xs text-red-500">
                  {uploadError && isUploading === docType.type && uploadError}
                </div>
                <div>
                  {existingDoc?.url && (
                    <Button variant="outline" size="sm" asChild className="mr-2">
                      <a href={existingDoc.url} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  )}
                  <label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isUploading !== null}
                      onChange={(e) => handleFileChange(e, docType.type)}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <span>{existingDoc ? 'Replace' : 'Upload'}</span>
                    </Button>
                  </label>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-cameroon-blue font-medium">Verification Status</h3>
        <p className="text-sm text-gray-600 mt-1">
          {documents.length === 0 
            ? "No documents uploaded yet. Please upload the required documents to verify your account." 
            : documents.every(doc => doc.status === 'VERIFIED')
              ? "All documents have been verified. Your account is fully verified."
              : documents.some(doc => doc.status === 'REJECTED')
                ? "One or more documents have been rejected. Please upload new documents."
                : "Your documents are pending review. We'll notify you when they're verified."}
        </p>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
